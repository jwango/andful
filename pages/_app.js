import App from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

import ActiveLink from '../components/active-link/active-link.component';

import '../styles/sass/main.scss';
import './_app.scss';

const THEME_TYPES = {
    DEFAULT: 'app--default'
}

export default class MyApp extends App {

    constructor(props) {
        super(props);
        this.state = {
            theme: THEME_TYPES.DEFAULT
        };
    }

    render() {
        const Component = this.props.Component;
        const pageProps = this.props.pageProps;
        return (<>
            <Head>
                <script defer src='https://use.fontawesome.com/releases/v5.7.0/js/solid.js' integrity='sha384-6FXzJ8R8IC4v/SKPI8oOcRrUkJU8uvFK6YJ4eDY11bJQz4lRw5/wGthflEOX8hjL' crossOrigin='anonymous'></script>
                <script defer src='https://use.fontawesome.com/releases/v5.7.0/js/fontawesome.js' integrity='sha384-av0fZBtv517ppGAYKqqaiTvWEK6WXW7W0N1ocPSPI/wi+h8qlgWck2Hikm5cxH0E' crossOrigin='anonymous'></script>
            </Head>
            <span className={this.state.theme}>
                <div className='container column'>
                    <header className='main__header'>
                        <h1>blog-react</h1>
                    </header>
                    <nav>
                        <ActiveLink href={'/'} aliases={['/posts']} activeClassName={'nav-link--active'}>Blog</ActiveLink>
                        <ActiveLink href={'/about'} activeClassName={'nav-link--active'}>About</ActiveLink>
                    </nav>

                    <main><Component {...pageProps} /></main>

                    <hr className='main__footer-separator'/>
                    <footer className='main__footer'>
                        <p>
                            Got any thoughts or questions? Contact the <Link href={'/about'}><a>author</a></Link>! |&nbsp;
                            <a href='https://github.com/jwango/blog-react'><img src='/GitHub-Mark-120px-plus.png' alt='github icon' className='main__footer-icon'></img> source code</a> |&nbsp;
                            <a href='/rss.xml'><img src='/rss-icon.png' alt='rss icon' className='main__footer-icon'></img> feed</a>
                        </p>
                    </footer>
                </div>
            </span>
        </>);
    }
}