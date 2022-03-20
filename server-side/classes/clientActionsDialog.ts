import ClientActionBase from "./clientActionsBase";

export default class ClientActionDialogTest extends ClientActionBase {
  async Test(data): Promise<{ success: boolean; resObject: any }> {
    const Data = JSON.parse(data);
    const Value = JSON.parse(Data.Value);
    return {
      success: Data.Success,
      resObject: {
        SelectedAction: Value.Data.Actions[0].key,
      },
    };
  }

  async NegativeTest(data: any): Promise<{ success: boolean; resObject: any }> {
    return {
      success: false,
      resObject: {
        SelectedAction: "rand-negative-string-for-test",
      },
    };
  }
}
