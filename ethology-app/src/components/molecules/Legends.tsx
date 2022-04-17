import { Badge, Grid, Typography } from "@mui/material";
import React from "react";
import { GoVerified } from "react-icons/go";
import { getColorByAvailability } from "../utils";

const Legends = () => {
  return (
    <Grid container direction="row-reverse" spacing={2} paddingBottom={3}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  color: getColorByAvailability("negative"),
                  backgroundColor: getColorByAvailability("negative"),
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Finished
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  color: getColorByAvailability("neutral"),
                  backgroundColor: getColorByAvailability("neutral"),
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Finishing
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  color: getColorByAvailability("positive"),
                  backgroundColor: getColorByAvailability("positive"),
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Available
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={0.5}>
          <Grid item>
            <GoVerified
              style={{
                marginTop: "0.45rem",
                height: "0.65rem",
                color: "#00acee",
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Verified
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Legends;
