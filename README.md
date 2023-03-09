# QANX Space | Testing utils

> ⚠ Contract is not run on the private blockchain and might function differently on-chain.

**Tool to easily test smart contracts written for QANX**

```js
import { call } from "qanx-testing-utils";

test("adds 1 + 2 to equal 3", () => {
  const result = call(
    {
      path: "C://path_to_contract/contract",
      args: ["sum", 1, 2],
      readSlots: [""],
    },
    {}
  );

  expect(result.events[0]).toBe("3");
});
```

```js
import { call } from "qanx-testing-utils";

test("update username", () => {
  const result = call(
    {
      path: "C://path_to_contract/contract",
      args: ["updateUser", "new_username"],
      readSlots: [""],
    },
    {
      USERNAME: "old_username",
    }
  );

  expect(result.events[0]).toBe(
    `Updated username from old_username to new_username`
  );
  expect(result.state.USERNAME).toBe(new_username);
  expect(result.writes).toBe(1);
});
```
