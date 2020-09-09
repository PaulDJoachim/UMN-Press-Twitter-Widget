import React, { Component } from "react";
import { connect } from "react-redux";
import LogOutButton from "../LogOutButton/LogOutButton";
import CSVReader from "../CsvParser/CsvParser";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InclusionToggle from "../Publications/InclusionToggle";
import Button from "@material-ui/core/Button";
import { spacing } from "@material-ui/system";

const styles = (theme) => ({
  root: {
    width: "80%",
    //marginLeft: theme.spacing.unit * 3,
    margin: "100px auto",
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  row: {
    "&:nth-of-type(odd)": {
      // backgroundColor: theme.palette.background.default,
      backgroundColor: "#f5f2ef",
    },
    title: {
      "&:hover": {
        // backgroundColor: theme.palette.grey[200],
        fontSize: "50px",
      },
    },
  },
  Btn: {
    margin: "40px 30px 50px 50px",
  },
});

class PublicationTable2 extends Component {
  render() {
    const { classes } = this.props;
    const CustomTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);
    return (
      <>
        {this.props.publication ? (
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Title</CustomTableCell>
                  <CustomTableCell>Subtitle</CustomTableCell>
                  <CustomTableCell>Author</CustomTableCell>
                  <CustomTableCell>Last Searched</CustomTableCell>
                  <CustomTableCell>Include/Exclude</CustomTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {this.props.publication.map((book) => (
                  <TableRow className={classes.row} key={book.id}>
                    <TableCell
                      className={classes.title}
                      onClick={() => {
                        this.props.history.push(`publications/${book.id}`);
                      }}
                    >
                      {book.title}
                    </TableCell>
                    <TableCell align="left">{book.subtitle}</TableCell>
                    <TableCell align="left">{book.author1}</TableCell>
                    <TableCell align="left">
                      {book.last_searched == null
                        ? "No searches yet"
                        : book.last_searched}
                    </TableCell>
                    <TableCell>
                      <InclusionToggle
                        publicationId={book.id}
                        include={book.include}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : null}
      </>
    );
  }
}

// Instead of taking everything from state, we just want the user info.
const mapStateToProps = (state) => ({
  user: state.user,
  publication: state.publication,
});

// this allows us to use <App /> in index.js
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(PublicationTable2))
);
