# ZeroDev SDK

[See here for detailed documentation.](https://docs.zerodev.app)

## Examples

For examples using ZeroDev, check out [the examples repo](https://github.com/zerodevapp/zerodev-examples).

## Installation

To use the SDK, install the core package and its peer dependencies (Viem & Permissionless), along with any plugins you need:

```bash
npm install @zerodev/sdk @zerodev/ecdsa-validator viem permissionless
```

```bash
yarn add @zerodev/sdk @zerodev/ecdsa-validator viem permissionless
```

```bash
bun install @zerodev/sdk @zerodev/ecdsa-validator viem permissionless
```

## Building and Testing

Before running the tests, ensure you have installed [bun](https://bun.sh/) and all the necessary dependencies and built the core package:

```bash
bun install
bun run build
```

Then, copy the `.env.example` file to `.env` and define all necessary environment variables:

```bash
cp .env.example .env
```

Now you can run the tests:

```bash
bun test
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) for details on how to contribute to the project.

## License

The @zerodev packages are released under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Contact

If you have any questions or would like to get in touch with the team, please join our [Discord channel](https://discord.gg/KS9MRaTSjx).
