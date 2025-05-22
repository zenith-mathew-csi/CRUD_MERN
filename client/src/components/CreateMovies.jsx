import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateMovies = () => {
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    summary: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    img: "",
    summary: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleReset = () => {
    setFormData({ name: "", img: "", summary: "" });
    setSuccessMsg("");
    setErrorMsg("");
    setErrors({ name: "", img: "", summary: "" });
  };

  // Basic URL regex for validation (can be improved if needed)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);

    // Check if any errors exist
    if (
      validationErrors.name ||
      validationErrors.img ||
      validationErrors.summary
    ) {
      setErrors(validationErrors);
      setSuccessMsg("");
      setErrorMsg("");
      return;
    }

    try {
      await axios.post("http://localhost:8001/api/movies", {
        name: formData.name.trim(),
        img: formData.img.trim(),
        summary: formData.summary.trim(),
      });
      setSuccessMsg("Movie created successfully!");
      setErrorMsg("");
      setErrors({ name: "", img: "", summary: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setErrorMsg("Failed to create movie. Please try again.");
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
          Create New Movie
        </Typography>

        {/* Alerts */}
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

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Movie Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Image URL"
              name="img"
              fullWidth
              value={formData.img}
              onChange={handleChange}
              error={!!errors.img}
              helperText={errors.img}
            />
            <TextField
              label="Summary"
              name="summary"
              fullWidth
              multiline
              rows={4}
              value={formData.summary}
              onChange={handleChange}
              error={!!errors.summary}
              helperText={
                errors.summary ||
                "Summary should be between 20 and 300 characters."
              }
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button variant="outlined" color="warning" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateMovies;
