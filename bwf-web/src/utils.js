export function status(res){
  if( res.status >= 200 && res.status < 300){
    return res.json();
  }
  throw new Error(res.statusText);
}