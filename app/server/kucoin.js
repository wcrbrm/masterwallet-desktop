const axios = require('axios');
const crypto = require('crypto');

const base64Encode = (x) => {
    if (process.browser) return btoa(x);
    if (typeof Buffer !== 'undefined') return Buffer.from(x).toString('base64');
    return '';
};

const getServerTime = (baseUrl) => {
  return new Promise((res, rej) => {	
    axios({ method: 'get',  mode: 'no-cors', credentials : true, url: `${baseUrl}/v1/timestamp` })
    .then((response) => { // yes, we actually expect an error from the first request
       if (response && response.data && response.data.timestamp) { res(response.data.timestamp); }
       else rej('');
    })
    .catch((e) => { // yes, we actually expect an error from the first request
       if (e.response && e.response.data && e.response.data.timestamp) { res(e.response.data.timestamp); }
       else rej('');
    });
  });
};

const getFunds = (kucoinConfig) => {
    return new Promise((resolve, reject) => {
        if (!kucoinConfig.apiKey) { reject('Missing API KEY for Kucoin account'); return; }
        if (!kucoinConfig.secret) { reject('Missing API SECRET for Kucoin account'); return; }

        const baseUrl = "https://api.kucoin.com";
        getServerTime(baseUrl).then((time) => {
          const nonce = time + 1000;

          const endpoint = '/v1/account/balance';
          const queryString = '';
          const strForSign = endpoint + "/" + nonce + "/" + queryString;
          const signature = crypto.createHmac('sha256', kucoinConfig.secret)
              .update(base64Encode(strForSign)).digest('hex'); // set the HMAC hash header
          const headers = {};
          headers["KC-API-KEY"] = kucoinConfig.apiKey;
          headers["KC-API-NONCE"] = nonce;
          headers["KC-API-SIGNATURE"] = signature;
          axios({ method: 'get',  mode: 'no-cors', credentials : true, url: `${baseUrl}${endpoint}`, headers })
              .then((response) => {
		console.log(JSON.stringify(response.data));
/*     
                  const assets = [];
                  response.data.data.forEach(asset => {
                      const balance = asset.balance + asset.freezeBalance;
                      assets.push({ symbol: asset.coinType, balance });
                  });
                  (async () => {
                    for (let i = 0; i< assets.length; i++) {
                       const symbolInfo = await symbol.getSymbolInfo(assets[i].symbol, assets[i].balance);
                       Object.keys(symbolInfo).forEach((key) => (assets[i][key] = symbolInfo[key]));
                    }
                    resolve(assets);
                  })();
*/     
              }).catch((e) => {

		console.log(e.response.data);
                  if (e.response && e.response.data && e.response.data.msg) { reject(e.response.data.msg); }
                  else if (e.response && e.response.data) { reject(e.response.data); }
                  else reject(e);
              });
        });
    });
};


getFunds({
  apiKey: '5a6ed4d22933c1196145e2e5',
  secret: 'b856c734-82ea-47f2-8982-9efe7eb2c7c9'
});