# Enhancements

## Publications to Add

- [x] Dare County Economic Development Strategic Plan (2016)
  - URL: https://www.darenc.gov/home/showpublisheddocument/1233/636179214120300000
  - Tag: innovation

## Copy Ideas

- [ ] Disambiguate "chart" wording: section header "Chart Review" (publications) and
      project-card button "Open chart ↗" (After-Hours Clinic) use "chart" for two
      different things (medical records vs. project pages). Candidate button copy:
      "Visit unit ↗" or "See rounds ↗". Button string lives in `renderUnits()` in
      `script.js`.

## Future Enhancements

- [ ] Zack's Arcade (`projects.arcade` in `script.js` / `healthcare.js`) currently
      lists its stack as Claude Code, GitHub, HTML5 Canvas. The games also have an
      online high-score leaderboard via Firebase (Firestore + Auth, dynamically
      imported with an offline-safe fallback) -- once that feature feels more
      built-out/prominent, consider adding "Firebase" to the stack tag and/or
      mentioning the leaderboard in the project description.
