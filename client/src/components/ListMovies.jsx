import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ListMovies = () => {
  const [movies, setMovies] = useState([]);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/movies");
      setMovies(res.data);
    } catch (err) {
      setErrorMsg("Failed to load movies.");
    }
  };

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Delete "${name}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8001/api/movies/${id}`);
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
      setSuccessMsg(`"${name}" deleted successfully`);
    } catch (err) {
      setErrorMsg("Failed to delete movie.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  const toggleSummary = (id) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Movie List
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create")}
        >
          Create Movie
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Summary</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movies.map((movie) => {
              const isExpanded = expandedSummaries[movie._id];
              const shouldTruncate = movie.summary.length > 200;
              const displaySummary = isExpanded
                ? movie.summary
                : movie.summary.slice(0, 200);

              return (
                <TableRow
                  key={movie._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      maxWidth: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {movie.name}
                  </TableCell>
                  <TableCell>
                    <img
                      src={movie.img}
                      alt={movie.name}
                      style={{
                        width: 100,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {displaySummary}
                    {shouldTruncate && (
                      <>
                        {!isExpanded && "... "}
                        <Button
                          size="small"
                          onClick={() => toggleSummary(movie._id)}
                          sx={{ textTransform: "none", ml: 1 }}
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(movie._id)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(movie._id, movie.name)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}

            {movies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No movies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Notifications */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMsg("")} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={3000}
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorMsg("")} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListMovies;
