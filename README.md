<p align="center">
  <a href="https://www.linkedin.com/company/open-template-hub">
    <img src="https://avatars2.githubusercontent.com/u/65504426?s=200&v=4" alt="Logo">
  </a>
</p>

<h1 align="center">
Open Template Hub - File Storage Server Template v2
</h1>

[![License](https://img.shields.io/github/license/open-template-hub/file-storage-server-template?color=43b043&style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/open-template-hub/file-storage-server-template?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/file-storage-server-template/issues)
[![PRCLosed](https://img.shields.io/github/issues-pr-closed-raw/open-template-hub/file-storage-server-template?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/file-storage-server-template/pulls?q=is%3Apr+is%3Aclosed)
[![LastCommit](https://img.shields.io/github/last-commit/open-template-hub/file-storage-server-template?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/file-storage-server-template/commits/master)
[![Release](https://img.shields.io/github/release/open-template-hub/file-storage-server-template?include_prereleases&color=43b043&style=for-the-badge)](https://github.com/open-template-hub/file-storage-server-template/releases)
[![SonarCloud](https://img.shields.io/sonar/quality_gate/open-template-hub_file-storage-server-template?server=https%3A%2F%2Fsonarcloud.io&label=Sonar%20Cloud&style=for-the-badge&logo=sonarcloud)](https://sonarcloud.io/dashboard?id=open-template-hub_file-storage-server-template)
[![BTC](https://img.shields.io/badge/Donate-BTC-ORANGE?color=F5922F&style=for-the-badge&logo=bitcoin)](https://commerce.coinbase.com/checkout/8313af5f-de48-498d-b2cb-d98819ca7d5e)

File Storage Server Template that supports uploading and downloading files from AWS S3

## Ways to Begin

npm install --save-dev @types/node

### 1. Express Deploy

Deploy this template to Heroku

[![Deploy](https://img.shields.io/badge/Deploy_to-Heroku-7056bf.svg?style=for-the-badge&logo=heroku)](https://heroku.com/deploy?template=https://github.com/open-template-hub/file-storage-server-template)

### 2. Start with Server Generator

Create your server with Server Generator Package

[![NPM](https://img.shields.io/badge/NPM-server_generator-cb3837.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@open-template-hub/server-generator)

### 3. GitHub Template

Use this repository as a Template

[![GitHubTemplate](https://img.shields.io/badge/GitHub-Template-24292e.svg?style=for-the-badge&logo=github)](https://github.com/open-template-hub/file-storage-server-template/generate)

## Installations

Install **nodejs** and **npm** via **[nodejs.org](https://nodejs.org)**.

Check installed versions of **nodejs** and **npm** via running following commands:

```
node -v
npm -v
```

Check project's current **nodejs** and **npm** version from **[package.json](package.json)**.

## Environment Variables

If you don't give **RESPONSE_ENCRYPTION_SECRET**, response encryption mechanism will be disabled automatically.

```applescript
PORT={Server Port}

ACCESS_TOKEN_SECRET={Access Token Secret}

DATABASE_URL={PostgreSQL Connection String}

MONGODB_URI={MongoDB Connection String}

RESPONSE_ENCRYPTION_SECRET={Response Encryption Secret}

MONGODB_CONNECTION_LIMIT={MongoDB Open Connection Limit}

POSTGRESQL_CONNECTION_LIMIT={PostgreSQL Open Connection Limit}
```

For pre-deployment of S3 provider, update **assets/sql/preload.data.json**
with your configuration:

```json
{
  "key": "S3",
  "description": "Amazon S3 Provider",
  "payload": {
    "service": "S3",
    "accessKeyId": "{AWS Access Key Id}",
    "secretAccessKey": "{AWS Secret Key Id}",
    "region": "{S3 Region}",
    "apiVersion": "{API Version}",
    "bucketName": "{S3 Bucket Name}"
  }
}
```

## Http Requests

You can find list of available http request in the [requests](assets/requests) directory. You can run http requests directly via **WebStorm**, for more information check out: [jetbrains.com/help/idea/http-client-in-product-code-editor.html](https://jetbrains.com/help/idea/http-client-in-product-code-editor.html)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/furknyavuz"><img src="https://avatars0.githubusercontent.com/u/2248168?s=460&u=435ef6ade0785a7a135ce56cae751fb3ade1d126&v=4" width="100px;" alt=""/><br /><sub><b>Furkan Yavuz</b></sub></a><br /><a href="https://github.com/open-template-hub/file-storage-server-template/issues/created_by/furknyavuz" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/file-storage-server-template/commits?author=furknyavuz" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/file-storage-server-template/pulls?q=is%3Apr+reviewed-by%3Afurknyavuz" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/fatihturker"><img src="https://avatars1.githubusercontent.com/u/2202179?s=460&u=261b1129e7106c067783cb022ab9999aad833bdc&v=4" width="100px;" alt=""/><br /><sub><b>Fatih Turker</b></sub></a><br /><a href="https://github.com/open-template-hub/file-storage-server-template/issues/created_by/fatihturker" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/file-storage-server-template/commits?author=fatihturker" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/file-storage-server-template/pulls?q=is%3Apr+reviewed-by%3Afatihturker" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributing

* Fork it
* Create your update branch (git checkout -b my-feature-branch)
* Commit your changes (git commit -am 'Add some features')
* Push to the branch (git push origin my-feature-branch)
* Create new Pull Request

## LICENSE

The source code for this project is released under the [MIT License](LICENSE).
