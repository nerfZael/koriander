console.log("I INJECT!");

(window as any).koriander = {
  test: (msg: string) => {
    document.dispatchEvent(
      new CustomEvent("korianderExt_test", {
        detail: msg
      })
    );
  },
};
