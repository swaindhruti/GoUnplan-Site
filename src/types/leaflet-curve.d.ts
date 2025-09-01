import * as L from "leaflet";

declare module "leaflet" {
  function curve(
    path: (string | [number, number])[],
    options?: L.PathOptions
  ): L.Layer;
}
