# Project Structure Analyzer - Final Working Version
Set-StrictMode -Version Latest

# Configuration
$MaxDepth = 3
$CollapseThreshold = 8
$ShowFirstFiles = 5
$AutoExclude = $true

$ExcludeFolders = @('node_modules', '.git', '.vscode', '.idea', '.vs', 'dist', 'build', 'out', 'bin', 'obj', '__pycache__', '.cache', '.tmp', '.temp')
$ExcludeFiles = @('*.log', 'Thumbs.db', '.DS_Store', 'desktop.ini')
$ImportantFiles = @('index.html', 'main.html', 'home.html', 'package.json', 'composer.json', 'config.*', 'README.md', '.env*')

# Get start path
$startPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($startPath)) { $startPath = Get-Location }

Write-Host "Analyzing: $startPath" -ForegroundColor Cyan
$outputFile = Join-Path $startPath "project_structure.html"

# Stats
$script:stats = @{
    TotalFolders = 0
    TotalFiles = 0
    TotalSize = 0
    FileTypes = @{}
    LargestFolders = @()
    ExcludedCount = 0
    DepthReached = 0
}

# Helper functions
function Format-FileSize {
    param([long]$Size)
    if ($Size -eq 0) { return "0 B" }
    if ($Size -lt 1KB) { return "$Size B" }
    if ($Size -lt 1MB) { return "{0:N1} KB" -f ($Size / 1KB) }
    if ($Size -lt 1GB) { return "{0:N1} MB" -f ($Size / 1MB) }
    return "{0:N2} GB" -f ($Size / 1GB)
}

function Test-ShouldExclude {
    param([string]$Name, [bool]$IsFolder)
    if (-not $AutoExclude) { return $false }
    if ($IsFolder) {
        foreach ($pattern in $ExcludeFolders) {
            if ($Name -like $pattern) {
                $script:stats.ExcludedCount++
                return $true
            }
        }
    } else {
        foreach ($pattern in $ExcludeFiles) {
            if ($Name -like $pattern) { return $true }
        }
    }
    return $false
}

function Test-IsImportant {
    param([string]$Name)
    foreach ($pattern in $ImportantFiles) {
        if ($Name -like $pattern) { return $true }
    }
    return $false
}

function Build-TreeNode {
    param([string]$Path, [int]$Depth = 0, [string]$Name = "")

    if ($Depth -gt $script:stats.DepthReached) { $script:stats.DepthReached = $Depth }
    if ($MaxDepth -gt 0 -and $Depth -ge $MaxDepth) { return $null }

    $node = @{
        name = $Name
        type = "folder"
        children = @()
        size = 0
        fileCount = 0
    }

    try {
        $items = Get-ChildItem -LiteralPath $Path -Force -ErrorAction Stop
    } catch {
        return $node
    }

    $folders = @($items | Where-Object { $_.PSIsContainer }) | Sort-Object Name
    $files = @($items | Where-Object { -not $_.PSIsContainer }) | Sort-Object Name

    foreach ($folder in $folders) {
        if (Test-ShouldExclude -Name $folder.Name -IsFolder $true) { continue }
        $script:stats.TotalFolders++
        $childNode = Build-TreeNode -Path $folder.FullName -Depth ($Depth + 1) -Name $folder.Name
        if ($childNode) {
            $node.children += $childNode
            $node.size += $childNode.size
            $node.fileCount += $childNode.fileCount
        }
    }

    $visibleFiles = @()
    $hiddenFileCount = 0
    $hiddenFileTypes = @{}

    $fileCount = @($files).Count

    foreach ($file in $files) {
        if (Test-ShouldExclude -Name $file.Name -IsFolder $false) { continue }

        $script:stats.TotalFiles++
        $script:stats.TotalSize += $file.Length

        $ext = $file.Extension.ToLower()
        if ([string]::IsNullOrEmpty($ext)) { $ext = "none" }
        if (-not $script:stats.FileTypes.ContainsKey($ext)) {
            $script:stats.FileTypes[$ext] = @{ count = 0; size = 0 }
        }
        $script:stats.FileTypes[$ext].count++
        $script:stats.FileTypes[$ext].size += $file.Length

        $node.size += $file.Length
        $node.fileCount++

        if ($CollapseThreshold -gt 0 -and $fileCount -gt $CollapseThreshold) {
            if ($visibleFiles.Count -lt $ShowFirstFiles) {
                $visibleFiles += @{
                    name = $file.Name
                    type = "file"
                    size = $file.Length
                    important = Test-IsImportant -Name $file.Name
                }
            } else {
                $hiddenFileCount++
                if (-not $hiddenFileTypes.ContainsKey($ext)) { $hiddenFileTypes[$ext] = 0 }
                $hiddenFileTypes[$ext]++
            }
        } else {
            $visibleFiles += @{
                name = $file.Name
                type = "file"
                size = $file.Length
                important = Test-IsImportant -Name $file.Name
            }
        }
    }

    $node.children += $visibleFiles

    if ($hiddenFileCount -gt 0) {
        $typeBreakdown = ($hiddenFileTypes.GetEnumerator() | ForEach-Object { "$($_.Value) $($_.Key)" }) -join ", "
        $node.children += @{
            name = "... ($hiddenFileCount more: $typeBreakdown)"
            type = "collapsed"
        }
    }

    if ($node.fileCount -gt 0) {
        $script:stats.LargestFolders += @{
            name = $Name
            fileCount = $node.fileCount
            size = $node.size
        }
    }

    return $node
}

# Build tree
Write-Host "Building tree..." -ForegroundColor Cyan
$rootName = Split-Path -Leaf $startPath
$tree = Build-TreeNode -Path $startPath -Depth 0 -Name $rootName
$script:stats.LargestFolders = $script:stats.LargestFolders | Sort-Object -Property fileCount -Descending | Select-Object -First 10

Write-Host "Found: $($script:stats.TotalFiles) files, $($script:stats.TotalFolders) folders" -ForegroundColor Green
Write-Host "Size: $(Format-FileSize $script:stats.TotalSize)" -ForegroundColor Green

# Generate HTML
Write-Host "Generating HTML..." -ForegroundColor Cyan

# Convert to JSON and escape properly
$treeJson = $tree | ConvertTo-Json -Depth 100 -Compress
$statsJson = $script:stats | ConvertTo-Json -Depth 10 -Compress

# Build complete HTML as a string array
$htmlLines = @()
$htmlLines += '<!DOCTYPE html>'
$htmlLines += '<html><head><meta charset="UTF-8"><title>Project Structure</title>'
$htmlLines += '<style>body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5}.container{max-width:1400px;margin:0 auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.header{border-bottom:2px solid #333;padding-bottom:10px;margin-bottom:20px}h1{margin:0;color:#333}.controls{margin:20px 0;display:flex;gap:10px;flex-wrap:wrap}button{padding:10px 20px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px}button:hover{background:#0056b3}.search-box{flex:1;min-width:300px}input{width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:14px}.main{display:grid;grid-template-columns:1fr 400px;gap:20px}.tree{background:#fafafa;padding:15px;border-radius:4px;max-height:70vh;overflow:auto}.stats{background:#f0f0f0;padding:15px;border-radius:4px}.tree-item{margin:2px 0;padding:4px;cursor:pointer}.tree-item:hover{background:#e8e8e8;border-radius:3px}.tree-folder{color:#0066cc;font-weight:bold}.tree-file{color:#666}.tree-important{color:#ff6600;font-weight:bold}.tree-size{color:#999;font-size:12px;margin-left:10px}.tree-children{margin-left:20px;display:none}.tree-children.show{display:block}.toggle{display:inline-block;width:20px;text-align:center;font-weight:bold}.stats-section{margin-bottom:20px}.stats-section h3{margin:0 0 10px 0;color:#333;font-size:14px;border-bottom:1px solid #ddd;padding-bottom:5px}.stat-item{padding:5px 0;display:flex;justify-content:space-between;font-size:13px}.stat-label{color:#666}.stat-value{color:#333;font-weight:bold}.hidden{display:none!important}</style>'
$htmlLines += '</head><body><div class="container">'
$htmlLines += '<div class="header"><h1>Project Structure Analyzer</h1></div>'
$htmlLines += '<div class="controls"><div class="search-box"><input id="search" type="text" placeholder="Search files and folders..."></div><button id="expandBtn">Expand All</button><button id="collapseBtn">Collapse All</button><button id="copyBtn">Copy Tree</button></div>'
$htmlLines += '<div class="main"><div class="tree" id="tree"></div><div class="stats" id="stats"></div></div></div>'
$htmlLines += '<script>'
$htmlLines += "var treeData=$treeJson;"
$htmlLines += "var statsData=$statsJson;"
$htmlLines += 'function renderTree(){var html="";function render(node,depth){if(!node)return"";var id="n"+Math.random().toString(36).substr(2,9);var indent="<span style=\"display:inline-block;width:"+(depth*20)+"px\"></span>";var line="<div class=\"tree-item\" data-id=\""+id+"\">";if(node.type==="folder"){var hasKids=node.children&&node.children.length>0;line+=indent;if(hasKids){line+="<span class=\"toggle\" data-nodeid=\""+id+"\">+</span>"}else{line+="<span class=\"toggle\"> </span>"}line+="<span class=\"tree-folder\">[+] "+node.name+"/</span>";if(node.fileCount>0){line+="<span class=\"tree-size\">("+node.fileCount+" files)</span>"}line+="</div>";if(hasKids){line+="<div class=\"tree-children\" id=\""+id+"\">";node.children.forEach(function(child){line+=render(child,depth+1)});line+="</div>"}}else if(node.type==="file"){line+=indent+"<span class=\"toggle\"> </span>";var cls=node.important?"tree-important":"tree-file";line+="<span class=\""+cls+"\">[-] "+node.name;if(node.important)line+=" [*]";line+="</span>";line+="<span class=\"tree-size\">"+formatSize(node.size)+"</span>";line+="</div>"}else{line+=indent+"<span class=\"toggle\"> </span><span class=\"tree-file\">"+node.name+"</span></div>"}return line}html=render(treeData,0);document.getElementById("tree").innerHTML=html}'
$htmlLines += 'document.addEventListener("click",function(e){if(e.target.hasAttribute("data-nodeid")){var id=e.target.getAttribute("data-nodeid");var children=document.getElementById(id);if(children){if(children.classList.contains("show")){children.classList.remove("show");e.target.textContent="+"}else{children.classList.add("show");e.target.textContent="-"}}}});'
$htmlLines += 'document.getElementById("expandBtn").addEventListener("click",function(){document.querySelectorAll(".tree-children").forEach(function(el){el.classList.add("show")});document.querySelectorAll(".toggle").forEach(function(el){if(el.textContent==="+")el.textContent="-"})});'
$htmlLines += 'document.getElementById("collapseBtn").addEventListener("click",function(){document.querySelectorAll(".tree-children").forEach(function(el){el.classList.remove("show")});document.querySelectorAll(".toggle").forEach(function(el){if(el.textContent==="-")el.textContent="+"})});'
$htmlLines += 'function renderStats(){var html="<div class=\"stats-section\"><h3>Overview</h3>";html+="<div class=\"stat-item\"><span class=\"stat-label\">Total Folders:</span><span class=\"stat-value\">"+statsData.TotalFolders+"</span></div>";html+="<div class=\"stat-item\"><span class=\"stat-label\">Total Files:</span><span class=\"stat-value\">"+statsData.TotalFiles+"</span></div>";html+="<div class=\"stat-item\"><span class=\"stat-label\">Total Size:</span><span class=\"stat-value\">"+formatSize(statsData.TotalSize)+"</span></div>";html+="<div class=\"stat-item\"><span class=\"stat-label\">Max Depth:</span><span class=\"stat-value\">"+statsData.DepthReached+"</span></div>";html+="</div>";html+="<div class=\"stats-section\"><h3>File Types</h3>";var types=Object.keys(statsData.FileTypes).map(function(k){return{ext:k,count:statsData.FileTypes[k].count,size:statsData.FileTypes[k].size}}).sort(function(a,b){return b.count-a.count});types.forEach(function(t){html+="<div class=\"stat-item\"><span class=\"stat-label\">"+t.ext+":</span><span class=\"stat-value\">"+t.count+" ("+formatSize(t.size)+")</span></div>"});html+="</div>";if(statsData.LargestFolders&&statsData.LargestFolders.length>0){html+="<div class=\"stats-section\"><h3>Largest Folders</h3>";statsData.LargestFolders.slice(0,5).forEach(function(f,i){html+="<div class=\"stat-item\"><span class=\"stat-label\">"+(i+1)+". "+f.name+":</span><span class=\"stat-value\">"+formatSize(f.size)+"</span></div>"});html+="</div>"}if(statsData.ExcludedCount>0){html+="<div class=\"stats-section\"><h3>Excluded</h3><div class=\"stat-item\"><span class=\"stat-label\">Folders:</span><span class=\"stat-value\">"+statsData.ExcludedCount+"</span></div></div>"}document.getElementById("stats").innerHTML=html}'
$htmlLines += 'function formatSize(bytes){if(bytes===0)return"0 B";if(bytes<1024)return bytes+" B";if(bytes<1048576)return(bytes/1024).toFixed(1)+" KB";if(bytes<1073741824)return(bytes/1048576).toFixed(1)+" MB";return(bytes/1073741824).toFixed(2)+" GB"}'
$htmlLines += 'document.getElementById("copyBtn").addEventListener("click",function(){var text="";function build(node,depth,prefix){if(!node)return;var connector=prefix;if(node.type==="folder"){text+=connector+node.name+"/";if(node.fileCount>0)text+=" ("+node.fileCount+" files)";text+="\n";if(node.children){node.children.forEach(function(child){build(child,depth+1,prefix+"  ")})}}else if(node.type==="file"){text+=connector+node.name+" ("+formatSize(node.size)+")\n"}else{text+=connector+node.name+"\n"}}build(treeData,0,"");navigator.clipboard.writeText(text).then(function(){alert("Copied to clipboard!")}).catch(function(){alert("Copy failed - please select and copy manually")})});'
$htmlLines += 'document.getElementById("search").addEventListener("input",function(e){var query=e.target.value.toLowerCase();var items=document.querySelectorAll(".tree-item");items.forEach(function(item){var text=item.textContent.toLowerCase();if(text.includes(query)||query===""){item.classList.remove("hidden")}else{item.classList.add("hidden")}})});'
$htmlLines += 'renderTree();renderStats();'
$htmlLines += '</script></body></html>'

# Write to file
$htmlLines -join "`n" | Out-File -FilePath $outputFile -Encoding UTF8 -Force

Write-Host "Done! Opening browser..." -ForegroundColor Green
Write-Host "File: $outputFile" -ForegroundColor Yellow

Start-Process $outputFile
