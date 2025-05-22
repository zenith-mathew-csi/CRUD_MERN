import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
  Collapse,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateMovies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    img: "",
    summary: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    img: "",
    summary: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8001/api/movies/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => setErrorMsg("Failed to load movie data.", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setErrorMsg(""); // Also clear general error when typing
  };

  // Basic URL regex for validation
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;

  const validate = (data) => {
    const errs = {
      name: "",
      img: "",
      summary: "",
    };

    // Validate name
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      errs.name = "Name cannot be empty.";
    } else if (trimmedName.length < 2) {
      errs.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 100) {
      errs.name = "Name cannot exceed 100 characters.";
    }

    // Validate image URL
    const trimmedImg = data.img.trim();
    if (!trimmedImg) {
      errs.img = "Image URL cannot be empty.";
    } else if (trimmedImg.length > 300) {
      errs.img = "Image URL cannot exceed 300 characters.";
    } else if (!urlRegex.test(trimmedImg)) {
      errs.img = "Please enter a valid URL.";
    }

    // Validate summary
    const trimmedSummary = data.summary.trim();
    if (!trimmedSummary) {
      errs.summary = "Summary cannot be empty.";
    } else if (trimmedSummary.length < 20) {
      errs.summary = "Summary must be at least 20 characters.";
    } else if (trimmedSummary.length > 300) {
      errs.summary = "Summary cannot exceed 300 characters.";
    }

    return errs;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);

    if (
      validationErrors.name ||
      validationErrors.img ||
      validationErrors.summary
    ) {
      setFieldErrors(validationErrors);
      setSuccessMsg("");
      setErrorMsg(""); // Clear general error msg
      return;
    }

    try {
      await axios.put(`http://localhost:8001/api/movies/${id}`, formData);
      setSuccessMsg("Movie updated successfully!");
      setErrorMsg("");
      setFieldErrors({ name: "", img: "", summary: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setErrorMsg("Update failed. Please try again.");
      setSuccessMsg("");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Update Movie
        </Typography>

        <Collapse in={!!successMsg}>
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        </Collapse>
        <Collapse in={!!errorMsg}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        </Collapse>

        <form onSubmit={handleUpdate}>
          <Stack spacing={3}>
            <TextField
              label="Movie Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />
            <TextField
              label="Image URL"
              name="img"
              fullWidth
              value={formData.img}
              onChange={handleChange}
              error={!!fieldErrors.img}
              helperText={fieldErrors.img}
            />
            <TextField
              label="Summary"
              name="summary"
              fullWidth
              multiline
              rows={4}
              value={formData.summary}
              onChange={handleChange}
              error={!!fieldErrors.summary}
              helperText={fieldErrors.summary}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateMovies;
