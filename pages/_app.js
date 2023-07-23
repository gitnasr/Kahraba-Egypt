import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component dir="rtl" {...pageProps} />
}

export default MyApp
