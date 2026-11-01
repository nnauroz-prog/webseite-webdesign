// Wird per `node --import ./tests/register.mjs --test …` geladen.
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
