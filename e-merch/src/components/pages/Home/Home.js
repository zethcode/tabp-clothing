import { Container, CssBaseline, Grid, Typography, Slide, Link, Zoom, Box } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { Parallax } from 'react-parallax';
import titleBG from './../../../assets/images/group-men-car.jpg';
import productBG from './../../../assets/images/bnw-graffiti-wall-low.jpg';
import useWindowPosition from '../../hook/useWindowPosition';
import Product from '../../Product/Product';
import useStyles from './styles';
import { useMediaQuery } from 'react-responsive';
import SnackbarAlert from '../../SnackbarAlert';
import { useSelector, useDispatch} from 'react-redux';
import { selectLoadingStatus } from '../../../app/loadingSlice';
import { setAlert, selectIsOpen } from '../../../app/snackbarSlice';
import Footer from '../../Footer';
import LoadingBackdrop from '../../LoadingBackdrop';
import { useLocation } from 'react-router-dom';
import { scroller, animateScroll, Element } from 'react-scroll';

const Home = () => {
    const [headerChecked, setHeaderChecked] = useState(false)
    const isMobile = useMediaQuery({ query: `(max-width: 959px)` })
    const reviewsChecked = useWindowPosition('reviews-section')
    const aboutChecked = useWindowPosition('about-section')
    const snackbarOpen = useSelector(selectIsOpen)
    const isLoading = useSelector(selectLoadingStatus)
    const location = useLocation()
    const dispatch = useDispatch() 
    const classes = useStyles()

    // console.log("Re-Rendered")

    useEffect(() => {
        if (location.hash) {
            scroller.scrollTo("productsSection", {
                duration: 1500,
                delay: 200,
                smooth: true
              })
        } else {
            animateScroll.scrollToTop({
                duration: 800,
                delay: 10,
                smooth: true
            })
        }
        setHeaderChecked(true)
        dispatch(setAlert({
            isOpen: false,
            success: false,
            severity: null,
            message: null
        }))
    }, [location, dispatch])
      
    return (
        <div className={classes.root} id="home-root">
            {snackbarOpen && <SnackbarAlert />}
            {isLoading && <LoadingBackdrop />}
            <Parallax className={classes.header} bgImage={titleBG} bgImageAlt="Explore Style" strength={400}>
                <div className={classes.darkBG}>
                    <Container className={classes.headerContainer}>
                        <Grid container direction="row" justifyContent="center" style={{overflow: 'hidden'}}>
                            <Slide direction="up" in={headerChecked} {...(headerChecked && { timeout: 1000 })}>
                                <Grid item align="center">
                                    <Typography className={classes.headerTitle} variant="h1">Tela At Iba Pa</Typography>
                                    <Typography className={classes.headerTitle2} variant="h3">Clothing Company</Typography><br/>
                                    <Typography className={classes.headerSubtitle} variant="subtitle1">Explore your style. Never be afraid to express yourself through fashion.</Typography>
                                </Grid>
                            </Slide>
                        </Grid>
                    </Container>
                </div>
            </Parallax>
            <div className={classes.about} id="about-section">
                <Container direction="column" >
                    <Typography color="primary" variant="h5"><b>ABOUT</b></Typography><br/>
                    <Slide direction="right" in={aboutChecked || isMobile} {...((aboutChecked || isMobile) && { timeout: 1000 })}>
                        <Typography className={classes.aboutTitle} variant="h3">This is not an official store.</Typography>
                    </Slide>
                    <br/>
                    <Slide direction="left" in={aboutChecked || isMobile} {...((aboutChecked || isMobile) && { timeout: 1000 })}>
                        <Typography className={classes.aboutTitle} variant="h3">This website is functional, try it out!</Typography>
                    </Slide>
                    <br/>
                    <Slide direction="right" in={aboutChecked || isMobile} {...((aboutChecked || isMobile) && { timeout: 1000 })}>
                        <Typography className={classes.aboutTitle} variant="h3">The development is still in progress.</Typography>
                    </Slide>
                    <br/>
                    <Slide direction="left" in={aboutChecked || isMobile} {...((aboutChecked || isMobile) && { timeout: 1000 })}>
                        <div>
                            <Typography className={classes.aboutSubtitle} variant="h5">Created with React.js and Firebase (Cloud Firestore)<br/>I apologize in advance for bugs that you may or may not encounter :D</Typography><br/>
                            <Typography className={classes.aboutSubtitle2} variant="subtitle2">Check out the source code on my
                                <Link className={classes.aboutSubtitle2} href="https://github.com/zethcode/tabp-clothing/tree/main/e-merch">&nbsp;github repository</Link>
                            </Typography>
                        </div>
                    </Slide>
                </Container>
            </div>
            <Element id="products-section" name="productsSection">
            <Parallax className={classes.products} bgImage={productBG} bgImageAlt="Explore Style" strength={400}>
                <Grid item>
                    <Box style={{width: '100%', backgroundColor: 'black'}}>
                        <Typography align="center" className={classes.productsTitle} variant="h3"><b>CHECK OUT OUR SMALL COLLECTION</b></Typography>
                    </Box>
                </Grid>
                <br/>
                <Container className={classes.productsContainer} direction="column" >
                    <Grid 
                        container
                        spacing={2}
                        justifyContent="center"
                        className={classes.productsList}>
                            <Product />
                    </Grid>
                </Container>
            </Parallax>
            </Element>
            <div id="reviews-section">
                <Grid container direction="column" className={classes.reviews}>
                    <Typography className={classes.reviewTitle} variant="h4"><b>FAKE REVIEWS & TESTIMONIALS</b></Typography>
                    <br/>
                    <Grid item className={classes.reviewText}>
                        <Zoom align="right" in={reviewsChecked || isMobile} {...((reviewsChecked || isMobile) && { timeout: 1300 })}>
                            <div>
                                <Typography className={classes.reviewQuote} variant="h5"><i>"The products they offer have outstanding quality."</i></Typography>
                                <Typography className={classes.reviewer} variant="subtitle1">Kendall Jenner - July 2021</Typography>
                            </div>
                        </Zoom>
                        <div className={classes.toolbar} />
                        <Zoom align="left" in={reviewsChecked || isMobile} {...((reviewsChecked || isMobile) && { timeout: 1300 })}>
                            <div>
                                <Typography className={classes.reviewQuote} variant="h5"><i>"The fabric used for the clothes is remarkable.<br/>I feel so comfortable wearing them, both inside and out!"</i></Typography>
                                <Typography className={classes.reviewer} variant="subtitle1">Selena Gomez - February 2021</Typography>
                            </div>
                        </Zoom>
                        <div className={classes.toolbar} />
                        <Zoom align="right" in={reviewsChecked || isMobile} {...((reviewsChecked || isMobile) && { timeout: 1300 })}>
                            <div>
                                <Typography className={classes.reviewQuote} variant="h5"><i>"I really loved the shirts. Great service,<br/>big plus for the smooth and fast transaction."</i></Typography>
                                <Typography className={classes.reviewer} variant="subtitle1">Emma Stone - December 2020</Typography>
                            </div>
                        </Zoom>
                        <div className={classes.toolbar} />
                        <Zoom in={reviewsChecked || isMobile} {...((reviewsChecked || isMobile) && { timeout: 1300 })}>
                            <Typography className={classes.reviewSubtitle} variant="h5">These reviews might be fake, but these are expected for having excellent quality products, right?</Typography>
                        </Zoom>
                    </Grid>
                </Grid>
            </div>
            <Footer />
            <CssBaseline />
        </div>
    )
}

export default Home
