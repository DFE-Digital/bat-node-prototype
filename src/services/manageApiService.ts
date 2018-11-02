import axios from "axios";

export interface Provider {
  name: string;
  providerCode: string;
}

export default class ManageApiService {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.baseUrl = process.env.BAT_NODE_MANAGE_API_URL;
  }

  async getProviders(): Promise<any> {
    var res = await axios.get(this.baseUrl + "/api/organisations", {
      headers: { Authorization: "Bearer " + this.accessToken }
    });
    return res.data.map(x => ({ name: x.instName, providerCode: x.instCode } as Provider));
  }
}
