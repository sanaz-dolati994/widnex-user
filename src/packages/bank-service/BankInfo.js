

const allBankInfo = [
    { title: { fa: 'بانک انصار', en: 'Ansar Bank' }, prefix: ['627381'], logo: 'Ansar', color: '#C6393B', primary: '#B44B4C' },
    { title: { fa: 'بانک آینده', en: 'Ayande Bank' }, prefix: ['636214'], logo: 'Ayandeh', color: '#522D1D', primary: '#634C42' },
    { title: { fa: 'بانک حکمت ایرانیان', en: 'Hekmat Iranian Bank' }, prefix: ['636949'], logo: 'Bank-Hekmat', color: '#015BAA', primary: '#4D88BC' },
    { title: { fa: 'بانک مرکزی', en: 'Markazi Bank' }, prefix: ['636949'], logo: 'Bank-Marjazi', color: '#2E8DE0', primary: '#30699A' },
    { title: { fa: 'بانک دی', en: 'Day Bank' }, prefix: ['502938'], logo: 'Day', color: '#008A9F', primary: '#308693' },
    { title: { fa: 'بانک اقتصاد نوین', en: 'Eghtesad Novin Bank' }, prefix: ['627412'], logo: 'Eghtesad', color: '#701E72', primary: '#764377' },
    { title: { fa: 'بانک گردشگری', en: 'Tourism Bank' }, prefix: ['505416'], logo: 'Gardeshgari', color: '#B01117', primary: '#9E3A3E' },
    { title: { fa: 'بانک قوامین', en: 'Ghavamin Bank' }, prefix: ['639599'], logo: 'Ghavamin', color: '#0A5F3E', primary: '#366B57' },
    { title: { fa: 'بانک ایران زمین', en: 'Iran Zamin Bank' }, prefix: ['505785'], logo: 'Iranzamin', color: '#5613A2', primary: '#663C95' },
    { title: { fa: 'بانک کارآفرین', en: 'Karafarin Bank' }, prefix: ['627488', '502910'], logo: 'Karafarin', color: '#157215', primary: '#3D773D' },
    { title: { fa: 'بانک کشاورزی', en: 'Keshavarzi Bank' }, prefix: ['603770', '639217'], logo: 'keshavarzi', color: '#B6762A', primary: '#f1ef9a' },
    { title: { fa: 'موسسه اعتباری کوثر', en: 'Kosar Bank' }, prefix: ['505801'], logo: 'Kosar', color: '#940509', primary: '#8C3335' },
    { title: { fa: 'بانک مسکن', en: 'Maskan Bank' }, prefix: ['628023'], logo: 'Maskan', color: '#F25920', primary: '#D56338' },
    { title: { fa: 'بانک  مهر ایران', en: 'Qarzol-Hasaneh Mehr Iran Bank' }, prefix: ['606373'], logo: 'Mehr', color: '#289925', primary: '#498F47' },
    { title: { fa: 'بانک مهر اقتصاد', en: 'Mehr Eghtesad Bank' }, prefix: ['639370'], logo: 'Mehr-Eghtesad', color: '#00A652', primary: '#309863' },
    { title: { fa: 'بانک ملت', en: 'Mellat Bank' }, prefix: ['610433', '991975'], logo: 'Mellat', color: '#D8062D', primary: '#C22442' },
    { title: { fa: 'بانک ملی ایران', en: 'Iran melli bank' }, prefix: ['603799'], logo: 'Melli', color: '#F7A70B', primary: '#D99D28' },
    { title: { fa: 'بانک پارسیان', en: 'Parsian Bank' }, prefix: ['639194', '622106', '627884'], logo: 'Parsian', color: '#981210', primary: '#922D2C' },
    { title: { fa: 'بانک پاسارگاد', en: 'Pasargad Bank' }, prefix: ['639347', '502229'], logo: 'Pasargad', color: '#F0C239', primary: '#C6A953' },
    { title: { fa: 'پست بانک ایران', en: 'Post Bank' }, prefix: ['627760'], logo: 'postbank', color: '#008840', primary: '#308558' },
    { title: { fa: 'بانک رفاه کارگران', en: 'Refah Bank' }, prefix: ['589463'], logo: 'Refah', color: '#004B7F', primary: '#305F7F' },
    { title: { fa: 'بانک صادرات ایران', en: 'Saderat Bank' }, prefix: ['603769'], logo: 'Saderat', color: '#29166F', primary: '#493E75' },
    { title: { fa: 'بانک سامان', en: 'Saman Bank' }, prefix: ['621986'], logo: 'Saman', color: '#006FB8', primary: '#3075A3' },
    { title: { fa: 'بانک صنعت و معدن', en: 'Bank of Industry and Mine' }, prefix: ['627961'], logo: 'Sanatvamadan', color: '#A88B53', primary: '#9E885E' },
    { title: { fa: 'بانک سرمایه', en: 'Sarmayeh Bank' }, prefix: ['639607'], logo: 'Sarmayeh', color: '#214B6A', primary: '#39586F' },
    { title: { fa: 'بانک سپه', en: 'Sepah Bank' }, prefix: ['589210'], logo: 'Sepah', color: '#E8651D', primary: '#CE6C36' },
    { title: { fa: 'بانک شهر', en: 'Shahr Bank' }, prefix: ['502806', '504706'], logo: 'Shahr', color: '#DF343A', primary: '#C7474B' },
    { title: { fa: 'بانک سینا', en: 'Sina Bank' }, prefix: ['639346'], logo: 'Sina', color: '#19499E', primary: '#335796' },
    { title: { fa: 'بانک تجارت', en: 'Tejarat Bank' }, prefix: ['585983'], logo: 'Tejarat', color: '#2E428D', primary: '#4D5988' },
    { title: { fa: 'موسسه اعتباری توسعه', en: "Tose'e Bank" }, prefix: ['628157'], logo: 'Tosee', color: '#891F1A', primary: '#854340' },
    { title: { fa: 'بانک توسعه تعاون', en: "Tose'e Ta'avon Bank" }, prefix: ['502908'], logo: 'Tosee-Taavon', color: '#0a8999', primary: '#278793' },
    { title: { fa: 'بانک توسعه صادرات ایران', en: 'Export Development Bank' }, prefix: ['627648', '207177'], logo: 'Tosee-Saderat', color: '#046B10', primary: '#23702C' },
    { title: { fa: 'بانک رسالت', en: 'Resalat Bank' }, prefix: ['504172'], logo: 'Resalat', color: '#214B6A', primary: '#39586F' },

]


export default allBankInfo
