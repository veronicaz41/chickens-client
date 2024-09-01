# Chickens-client

This is the React client for the Chickens Game.

## Rust and WebAssembly

This project was created with `wasm-pack-template` by running:

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project
cd my-project
```

To build the project, run

```
wasm-pack build
```

It will compile our Rust code in `src` directory into a WebAssembly `.wasm` binary via `cargo`; and use `wasm-bindgen` to
generate the Javascript API for using our Rust generated WebAssembly.

The generated artifacts will be in `pkg` directory.

## React app

The React app is in `react-app` directory.

It is still work in progress.

To run the code for benchmarking, you need to use production build, run
```
yarn build
npx serve -s build
```
