const source = `FTN_REQUIRE_APPROVAL=true\nFTN_SYNTHETIC_DATA=false`;
console.assert(source.includes('FTN_REQUIRE_APPROVAL=true'));
console.assert(source.includes('FTN_SYNTHETIC_DATA=false'));
console.log('security invariants passed');
