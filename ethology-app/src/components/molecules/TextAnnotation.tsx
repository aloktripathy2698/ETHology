import { Grid, Typography } from "@mui/material";
import React from "react";
import { ITextAnnotation } from "../../interfaces/interface";

const TextAnnotation = (props: ITextAnnotation) => {
  const { availability, country, manufac_name } = props;
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <Typography variant="caption" fontWeight={600} color="#616161">
          Manufacturer:{" "}
        </Typography>
        <Typography variant="caption">{manufac_name || "N/A"}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption" fontWeight={600} color="#616161">
          Availability:{" "}
        </Typography>
        <Typography variant="caption">{availability || "N/A"}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption" fontWeight={600} color="#616161">
          Country:{" "}
        </Typography>
        <Typography variant="caption">{country|| "N/A"}</Typography>
      </Grid>
    </Grid>
  );
};

export default TextAnnotation;
