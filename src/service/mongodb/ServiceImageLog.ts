import { ImageLogI, ImageLog } from '../../entity/mongodb/log/MongoImageLog';
export default class ServiceImageLog {
    constructor() {}
    public async post(imageLog: ImageLogI): Promise<ImageLogI> {
        const saveResult = await imageLog.save();
        return saveResult;
    }

    public async delete(imageLog: ImageLogI): Promise<boolean> {
        const query = await ImageLog.update(
            {
                accountId: imageLog.accountId,
                eventId: imageLog.eventId,
            },
            {
                $set: {
                    use: false,
                    deleteDt: new Date(),
                },
            },
        );
        console.log(query);
        return true;
    }
}
