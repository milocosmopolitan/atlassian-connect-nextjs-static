const fetch = require('node-fetch');
const createTunnel = require('./create-tunnel');
// const http = require('http');
// https://ecosystem.atlassian.net/wiki/spaces/UPM/pages/6094960/UPM+REST+API

const BASEURL = 'https://test-omiologic.atlassian.net';

let upmToken;

function getUrlRequestObject(hostRegUrl, path, queryParams) {
  const uri = URI(hostRegUrl);
  const username = uri.username();
  const password = uri.password();
  uri.username("");
  uri.password("");
  // Remove any trailing slash from the uri
  // and any double product context from the path
  uri.pathname(
    uri.pathname().replace(/\/$/, "") +
      path.substring(path.indexOf("/rest/plugins/1.0"))
  );
  if (queryParams) {
    uri.query(queryParams);
  }
  return {
    uri: uri.toString(),
    auth: {
      user: username,
      pass: password
    }
  };
}

function getUpmToken() {
  return fetch(`${BASEURL}/rest/plugins/1.0/`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        'milowebmaster@gmail.com:b0fzjo5OFH7LrKNlmPiZ8EA0'
      ).toString('base64')}`
    }
  })
    .then(response => {
      return response.headers.get('upm-token');
      // console.log(response.headers.get('upm-token'))
      // console.log(
      //   `Response: ${response.status} ${response.statusText}`
      // );
      // return response.json();
    })
    // .then(text => console.log(text))
    .catch(err => console.error(err));
}




async function registerUPM(descriptorUrl) {
  const reqObject = getUrlRequestObject(hostRegUrl, "/rest/plugins/1.0/");
  reqObject.jar = false;

  upmToken = await getUpmToken();

  // return new Promise((resolve, reject) => {

  return fetch(`${BASEURL}/rest/plugins/1.0/?token=${upmToken}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        'milowebmaster@gmail.com:b0fzjo5OFH7LrKNlmPiZ8EA0'
      ).toString('base64')}`,
      'Content-Type': 'application/vnd.atl.plugins.remote.install+json'
    },
    body: JSON.stringify({ pluginUri: descriptorUrl })
  })
  .then(response => {
    console.log('Register Response\n', response)
    return response;
  })
  .catch(err => console.error(err));
}

// export function updatePlugin() {
//   return fetch(`${BASEURL}/rest/plugins/1.0/${plugin.key}-key`, {
//     method: 'PUT',
//     headers: {
//       'Authorization': `Basic ${Buffer.from(
//         'email@example.com:<api_token>'
//       ).toString('base64')}`,
//       'Content-Type': 'application/vnd.atl.plugins.plugin+json',
//       'Accept': 'application/json'
//     },
//     body: {}
//   })
//     .then(response => {
//       console.log(
//         `Response: ${response.status} ${response.statusText}`
//       );
//       return response.text();
//     })
//     .then(text => console.log(text))
//     .catch(err => console.error(err));
// }

// getUpmToken()
registerUPM(
  'https://e37e42355041.ngrok.io/atlassian-connect.json'
);
