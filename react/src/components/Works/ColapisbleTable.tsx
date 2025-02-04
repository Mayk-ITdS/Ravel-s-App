import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="center">{row.genre}</TableCell>
        <TableCell align="center">{row.compositionDate}</TableCell>
        <TableCell align="center">{row.premiere}</TableCell>
        <TableCell align="center">{row.description}</TableCell>
        <TableCell align="center">
          <a href={row.spotifyLink} target="_blank" rel="noopener noreferrer">
            Spotify Link
          </a>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                    <TableCell>Place</TableCell>
                    <TableCell>
                      {row.details.importantPerformancePlace}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>{row.details.date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Performers</TableCell>
                    <TableCell>{row.details.performers}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Coworkers</TableCell>
                    <TableCell>{row.details.coworkers}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({
  works,
}: {
  works: {
    title: string;
    genre: string;
    compositionDate: string;
    premiere: string;
    description: string;
    spotifyLink: string;
    details: {
      importantPerformancePlace: string;
      date: string;
      performers: string;
      coworkers: string;
    };
  }[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Title</TableCell>
            <TableCell align="center">Genre</TableCell>
            <TableCell align="center">Composition Date</TableCell>
            <TableCell align="center">Premiere</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Spotify Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {works.map((work) => (
            <Row key={work.title} row={work} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
