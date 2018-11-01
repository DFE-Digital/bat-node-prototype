# BAT Node Prototype

To run the project:

Copy one of the `.env.*` files to `.env`, e.g

```bash
cp .env.development .env
```

Replace `BAT_NODE_SIGNIN_CLIENT_SECRET` with the DfE Signin client secret. (If you have manage-courses-ui running locally, you should have it already)

Then:

```bash
npm install
npm run dev
```

The project is linted using `prettier`.
