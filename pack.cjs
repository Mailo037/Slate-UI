const {spawnSync}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
// Packaging is explicit; exclude the archive itself and Git metadata.
const files=fs.readdirSync(__dirname).filter(name=>name!=='Slate-UI.zip'&&name!=='.git'&&name!=='node_modules'&&!name.endsWith('.log'));
if(process.platform==='win32'){
 const quote=value=>"'"+value.replaceAll("'","''")+"'";
 const input=files.map(name=>quote(path.join(__dirname,name))).join(',');
 const result=spawnSync('powershell',['-NoProfile','-Command',`Compress-Archive -LiteralPath ${input} -DestinationPath ${quote(path.join(__dirname,'Slate-UI.zip'))} -Force`],{stdio:'inherit'});
 process.exitCode=result.status||0;
}else{
 const result=spawnSync('zip',['-r','Slate-UI.zip',...files],{cwd:__dirname,stdio:'inherit'});if(result.error){console.error('Install zip or create an archive with your file manager.');process.exitCode=1;}else process.exitCode=result.status||0;
}
