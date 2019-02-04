export default function delay(fn, time){
    return () => setTimeout(fn, time);
}