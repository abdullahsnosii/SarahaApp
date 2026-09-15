var longestCommonPrefix = function(strs) {
let prefix = strs[0]    
for(let str of strs){

    while(!str.startsWith(prefix)){
        prefix = prefix.slice(0 , prefix.length - 1 )
    }
    
    if(prefix === "") return "";
}

return prefix
};

const arr = ["flower" , "flowe" , "flight"]
const result = longestCommonPrefix(arr)
console.log({result:result});
