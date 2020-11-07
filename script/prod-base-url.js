const fs = require('fs');
const path = require('path');

const acConfPath = path.resolve(process.cwd(), 'out', 'atlassian-connect.json');
const acConfFile = fs.readFileSync(acConfPath, {encoding: 'utf-8'});
let parsedConf
try {
  parsedConf = JSON.parse(acConfFile);
} catch (error) {
  console.error(error);
}
parsedConf.baseUrl = 'http://jira-cloud-filter-linter.s3-website.us-east-2.amazonaws.com';

parsedConf.links = {
  self: "http://jira-cloud-filter-linter.s3-website.us-east-2.amazonaws.com/atlassian-connect.json",
  homepage: "http://jira-cloud-filter-linter.s3-website.us-east-2.amazonaws.com/atlassian-connect.json"
}

fs.writeFileSync(acConfPath, JSON.stringify(parsedConf, null, 2));
console.info(parsedConf);
