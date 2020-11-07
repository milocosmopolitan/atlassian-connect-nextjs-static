import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Atlassian Connect NextJS Document Layout Component
 * https://nextjs.org/docs/advanced-features/custom-document
 */
class ACPluginDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body style={{margin: 0}}>
          <div className="ac-content">
            <div id="content">
              <Main />
              <NextScript />
            </div>
          </div>
        </body>
      </Html>
    )
  }
}

export default ACPluginDocument
