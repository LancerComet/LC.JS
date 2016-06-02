// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #
// ---
// Internal Functions.

export const _ = {
    typeof: (target) => Object.prototype.toString.call(target).match(/ \S*/i)[0].replace(" ", "").replace("]", "").toLowerCase()
};