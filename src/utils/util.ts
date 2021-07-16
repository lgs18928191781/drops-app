import { Buffer } from 'buffer'
import { store } from '@/store'
import { ElMessage } from 'element-plus';
import i18n from '@/utils/i18n';

export function tranfromImgFile(file: File) {
    return new Promise<MetaFile>((resolve, reject) => {
        const fileType = file.type;
        const reader = new FileReader();
        let fileBinary: string;
        reader.onload = () => {
            const arrayBuffer = reader.result;
            let buffer: string = ''
            let hex: string = ''
            if (arrayBuffer) {
                // @ts-ignore
                buffer = Buffer.from(arrayBuffer);
                // @ts-ignore
                hex = buffer.toString('hex');
                fileBinary = buffer;
            }
            const fileData =
            "data:" + fileType + ";base64," + hexToBase64(hex);
            const imgData: MetaFile = {
              base64Data: fileData,
              BufferData: fileBinary,
              hexData: hex,
              name: file.name,
              raw: file,
              data_type: fileType
            };
            /*
            fileBinary二进制流
            fileData 图片base64编码
            fileType 文件名
            */
            resolve(imgData)
        };
        reader.onerror = (error) => {
            new Error(`handleFileChange error /n ${error}`, )
            reject(reject)
        }
        reader.readAsArrayBuffer(file);
    })
}

// 转换为图片
export function hexToBase64(str: string) {
    if (!str) {
      return "https://showjob.oss-cn-hangzhou.aliyuncs.com/index/img_photo_default.png";
    }
    var a = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
      a.push(parseInt(str.substr(i, 2), 16));
    }
    var binary = "";
    var bytes = new Uint8Array(a);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const sty = window.btoa(binary);
    return sty;
}

export function checkSdkStaut() {
  if (!store.state.token){
    ElMessage.warning(i18n.global.t('toLoginTip'))
    return false
  } else {
    if (store.state.sdkInitIng) {
      ElMessage.warning(i18n.global.t('loginingTip'))
      return false
    }
  }
}