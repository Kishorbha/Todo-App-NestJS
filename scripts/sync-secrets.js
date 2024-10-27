const fs = require('fs') // eslint-disable-line
const path = require('path') // eslint-disable-line

const localEnvFile = fs.readFileSync('misc.env').toString().split('\n')
const secret = localEnvFile
  .find((kv) => kv.startsWith('NOTION_INTEGRATE_API_KEY'))
  ?.split('=')
  .at(-1)
const db = {
  local: '5310bd2f9df34ff9a0cbb3de6e294b6c',
  dev: '63d39dd469484ba9aaa08203e4f0bba5',
}

;(async function main() {
  const ENV = process.argv[2]
  const file = fs.createWriteStream(path.join(__dirname, '..', `${ENV}.env`))
  try {
    await fetchAndWrite(db[ENV], file)
  } catch (err) {
    console.error(err)
  }
  file.close()
})()

async function fetchAndWrite(id, file) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${id}/query`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'Created',
            direction: 'ascending',
          },
        ],
      }),
    },
  ).then((data) => data.json())
  response.results.map(({ properties: { key, value } }) => {
    if (key.title[0] || value.rich_text[0]) {
      const k = key.title[0].plain_text
      const v = value.rich_text[0].plain_text
      file.write(`${k}=${v}\n`)
    }
  })
}
