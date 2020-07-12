// Author @patriciogv - 2015
// Title: Ikeda Data Stream

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_tex0;
uniform vec2        u_resolution;
uniform float       u_time;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main() {
    vec3 color = vec3(0.);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    color += texture2D(u_tex0, st).rgb;

    st.x *= u_resolution.x/u_resolution.y;

    vec2 grid = vec2(100.0,50.) * 3.0;
    st *= grid;

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 vel = vec2(u_time*2.*max(grid.x,grid.y)); // time
    vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction

    // Assign a random value base on the integer coord
    vec2 offset = vec2(0.1,0.);

    float amount = sin(u_time * 0.5 + random(ipos.y * 0.01) ) * 0.5 + 0.5;
    float margin = cos(u_time * 0.1 + random(ipos.y * 0.5) ) * 0.5 + 0.5;

    vec3 pat = vec3(0.0);
    pat.r = pattern(st+offset,vel,0.5+amount);
    pat.g = pattern(st,vel,0.5+amount);
    pat.b = pattern(st-offset,vel,0.5+amount);

    // Margins
    color += pat * step(0.2 * margin,fpos.y);

    gl_FragColor = vec4(color,1.0);
}