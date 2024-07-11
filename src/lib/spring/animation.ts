import type { DynamicAnimation } from "$lib/spring/interface";

/**
 * decay(t) = e^-ct
 * spring(t) = cos(at + b)
 * position(t) = decay(t) * spring(t)
 * Where:
 *  t: time
 *  a: amplitude
 *  b: phase shift
 *  c: decay constant
 * Condition:
 *  position(0) = 0
 *  velocity(0) = initial velocity
 * Parameter:
 *  bounciness - less c
 *  initial velocity - 
 *  reponse time - make every thing 
 * The different from google implementation(in androidx.animation) is how it handle startVelocity
 */
// export class SpringAnimation implements DynamicAnimation {
//     constructor(private) {

//     }
// }