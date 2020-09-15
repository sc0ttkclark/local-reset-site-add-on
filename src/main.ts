// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';

export default function (context) {
    const {electron} = context;
    const {ipcMain} = electron;

    ipcMain.on('tribe-reset-site', async (event, siteId) => {
        LocalMain.getServiceContainer().cradle.localLogger.log('info', `Resetting site ${siteId}.`);

        // Get site object.
        const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);

        // Run WP-CLI command.
        await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
            'db',
            'reset',
            '--yes',
        ]).then(function (result) {
            LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db reset" finished.');

            // Run WP-CLI command.
            LocalMain.getServiceContainer().cradle.wpCli.run(site, [
                'core',
                'install',
                '--url=' + site.url,
                '--title=' + site.domain,
                '--admin_user=admin',
                '--admin_password=admin',
                '--admin_email=dev-email@flywheel.local',
                '--skip-email',
            ]).then(function (result) {
                LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp core install" finished.');

                LocalMain.sendIPCEvent('tribe-site-reset');
            }, function (err) {
                LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp core install" failed.');
                LocalMain.getServiceContainer().cradle.localLogger.log('info', err);

                LocalMain.sendIPCEvent('tribe-site-reset-install-failed');
            });
        }, function (err) {
            LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db reset" failed.');
            LocalMain.getServiceContainer().cradle.localLogger.log('info', err);

            LocalMain.sendIPCEvent('tribe-site-reset-failed');
        });
    });

    ipcMain.on('tribe-empty-site', async (event, siteId) => {
        LocalMain.getServiceContainer().cradle.localLogger.log('info', `Emptying site ${siteId}.`);

        // Get site object.
        const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);

        // Run WP-CLI command.
        await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
            'site',
            'empty',
            '--uploads',
            '--yes',
        ]).then(function (result) {
            LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp site empty" finished.');

            LocalMain.sendIPCEvent('tribe-site-emptied');
        }, function (err) {
            LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp site empty" failed.');
            LocalMain.getServiceContainer().cradle.localLogger.log('info', err);

            LocalMain.sendIPCEvent('tribe-site-empty-failed');
        });
    });
}
