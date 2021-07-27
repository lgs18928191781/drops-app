import MetaIdJs from "./metaidjs";
declare global {
    interface Window {
        MetaIdJs?: Function;
    }
}
export default MetaIdJs;
