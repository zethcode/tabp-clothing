import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingTop: "5%",
    },
    paper: {
        height: "34em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        paddingBottom: theme.spacing(10),
        paddingTop: theme.spacing(8),
        padding: theme.spacing(4)
    },
    formControl: {
        marginTop: theme.spacing(2)
    },
    submitButton: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(1),
        borderRadius: "1.5em",
        width: "13em"
    },
    authLogo: {
        width: "55%",
        height: "55%"
    }
}));