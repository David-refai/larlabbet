/* The detail models, by organ. */
import type {DetailId} from "../../bodyData";
import type {DetailModel} from "./detail";
import {buildHeartDetail} from "./heartDetail";
import {buildLungsDetail} from "./lungsDetail";
import {buildBrainDetail} from "./brainDetail";

export const makeDetail = (id: DetailId): DetailModel => id === "heart" ? buildHeartDetail() : id === "lungs" ? buildLungsDetail() : buildBrainDetail();
