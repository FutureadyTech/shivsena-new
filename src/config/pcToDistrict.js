/**
 * Lok Sabha (PC) constituency → district mapping for Maharashtra.
 * Standard ECI all-India numbering: Maharashtra's 48 LS seats are
 * PCs 224–271. This is the geographically correct assignment of each
 * PC to its primary district.
 *
 * Some PCs that span two districts are pinned to their largest one.
 */
export const PC_TO_DISTRICT = {
  PC224: 'nandurbar',
  PC225: 'dhule',
  PC226: 'jalgaon',
  PC227: 'jalgaon',
  PC228: 'buldhana',
  PC229: 'akola',
  PC230: 'amravati',
  PC231: 'wardha',
  PC232: 'nagpur',
  PC233: 'nagpur',
  PC234: 'bhandara',
  PC235: 'gadchiroli',
  PC236: 'chandrapur',
  PC237: 'yavatmal',
  PC238: 'hingoli',
  PC239: 'nanded',
  PC240: 'parbhani',
  PC241: 'jalna',
  PC242: 'aurangabad',
  PC243: 'nashik',
  PC244: 'nashik',
  PC245: 'palghar',
  PC246: 'thane',
  PC247: 'thane',
  PC248: 'thane',
  PC249: 'mumbai',
  PC250: 'mumbai',
  PC251: 'mumbai',
  PC252: 'mumbai',
  PC253: 'mumbai',
  PC254: 'mumbai',
  PC255: 'raigad',
  PC256: 'raigad',
  PC257: 'pune',
  PC258: 'pune',
  PC259: 'pune',
  PC260: 'ahmadnagar',
  PC261: 'ahmadnagar',
  PC262: 'beed',
  PC263: 'dharashiv',
  PC264: 'latur',
  PC265: 'solapur',
  PC266: 'solapur',
  PC267: 'sangli',
  PC268: 'satara',
  PC269: 'ratnagiri',
  PC270: 'kolhapur',
  PC271: 'kolhapur',
};

/* Reverse list of PCs belonging to each district */
export const DISTRICT_TO_PCS = Object.entries(PC_TO_DISTRICT).reduce((acc, [pc, dist]) => {
  if (!acc[dist]) acc[dist] = [];
  acc[dist].push(pc);
  return acc;
}, {});
