import { AccountsEventI } from './../../entity/mongodb/main/MongoAccounts';
import { Accounts, AccountsI } from '../../entity/mongodb/main/MongoAccounts';
export default class ServiceAuth {
    constructor() {}

    public async getAccountById(accounts: AccountsI): Promise<any> {
        const query = await Accounts.findById(accounts._id).lean();
        return query;
    }

    public async getAccountByIdEventId(
        accounts: AccountsI,
        accountsEvent: AccountsEventI,
    ): Promise<any> {
        console.log('Service Auth: ', accounts, accountsEvent);
        const query = await Accounts.findOne({
            _id: accounts._id,
            'eventList.eventId': accountsEvent._id,
        }).lean();
        return query;
    }
}
