import { useEffect, useState } from "react";
import style from "./AddMovie.module.css";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  TextField,
} from "@mui/material";

import { url } from "../../common";
import { Api, useDark } from "../../hooks";

const AddMovie = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    trailerLink: "",
    premiere: "2021-01-01",
    rating: 0,
    image: "",
    gener: "",
    duration: "",
  });
  const dark = useDark();
  const [errorForm, setErrorForm] = useState({
    description: false,
  });

  useEffect(() => {
    Api("/geners").then((data) => {
      setOptions(data || []);
    });
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onChange = (e) => {
    if (e.target.name === "rating") {
      setForm({ ...form, [e.target.name]: Number(e.target.value) });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const onChangeImg = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const postmovie = async (e) => {
    e.preventDefault();

    if (form.description.length < 30) {
      setErrorForm({ ...errorForm, description: true });
      return;
    }

    const formData = new FormData();

    for (let name in form) {
      formData.append(name, form[name]);
    }
    try {
      const res = await fetch(url + "/movie", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.id) {
        setOpen(false);
        window.location.replace("/movie/" + data.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen} fullWidth variant="contained">
        Add New Movie
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={dark ? { background: "#444", color: "#fff" } : {}}>
          New Movie
        </DialogTitle>
        <DialogContent
          style={dark ? { background: "#444", color: "#fff" } : {}}
        >
          <DialogContentText>Please fill all fields</DialogContentText>
          <form onSubmit={postmovie} className={style.form}>
            <TextField
              required={true}
              name="title"
              value={form.title}
              onChange={onChange}
              label="Movie's Name"
              fullWidth
              style={dark ? { background: "#eaeaea" } : {}}
            />
            <TextField
              required
              error={errorForm.description}
              helperText="min length 30"
              minRows="2"
              name="description"
              value={form.description}
              onChange={onChange}
              multiline
              id="description"
              label="Description"
              fullWidth
              style={dark ? { background: "#eaeaea" } : {}}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                required
                name="premiere"
                value={form.premiere}
                onChange={onChange}
                label="premiere"
                type="date"
                style={dark ? { background: "#eaeaea" } : {}}
              />
              <Rating name="rating" value={form.rating} onChange={onChange} />
            </div>
            <TextField
              required
              name="image"
              type="file"
              fullWidth
              onChange={onChangeImg}
              style={dark ? { background: "#eaeaea" } : {}}
            />
            <Autocomplete
              style={dark ? { background: "#eaeaea" } : {}}
              options={options.map((option) => option.tag)}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  name="gener"
                  onSelect={onChange}
                  onChange={onChange}
                  value={form.gener}
                  label="Gener"
                  type="search"
                />
              )}
            />
            <TextField
              style={dark ? { background: "#eaeaea" } : {}}
              required
              name="duration"
              value={form.duration}
              label="Duration in Minutes"
              type="number"
              fullWidth
              onChange={onChange}
            />
            <TextField
              style={dark ? { background: "#eaeaea" } : {}}
              required
              name="trailerLink"
              value={form.trailerLink}
              label="Trailer Link"
              type="url"
              fullWidth
              onChange={onChange}
            />
            <div>
              <Button type="submit" fullWidth variant="contained">
                Add Movie
              </Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions
          style={dark ? { background: "#444", color: "#fff" } : {}}
        >
          <Button onClick={handleClose} style={dark ? { color: "#fff" } : {}}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddMovie;
