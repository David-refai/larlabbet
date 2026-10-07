import {T, years, yearNow, setViewYear} from "../legacy/core.js";
/* the year switch under a course heading; `again` redraws the screen it sits on */
export function YearSeg({again}: {again: () => void}) {
  const ys: number[] = years();
  if (ys.length < 2) return null;
  return <div className="seg yseg" id="years" role="group">{ys.map(y =>
    <button key={y} data-y={y} aria-pressed={y === yearNow()} onClick={() => { setViewYear(y); again(); }}>{T("gradeChip")(y)}</button>)}</div>;
}
