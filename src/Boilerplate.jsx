import React, {Component} from 'react';
import {ipcRenderer} from 'electron';

// https://getflywheel.github.io/local-addon-api/modules/_local_renderer_.html
// https://github.com/getflywheel/local-components
import {LoadingIndicator, TableList, TableListRow, Text, TextButton} from '@getflywheel/local-components';

export default class Boilerplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			siteId: props.match.params.siteID,
			message: '',
		};

		// Click callbacks.
		this.resetSite = this.resetSite.bind(this);
		this.emptySite = this.emptySite.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on('tribe-site-reset', (event) => {
			this.setState({
				message: 'site-reset',
			});
		});
		ipcRenderer.on('tribe-site-reset-failed', (event) => {
			this.setState({
				message: 'site-reset-failed',
			});
		});
		ipcRenderer.on('tribe-site-reset-install-failed', (event) => {
			this.setState({
				message: 'site-reset-install-failed',
			});
		});
		ipcRenderer.on('tribe-site-emptied', (event) => {
			console.log( event );
			this.setState({
				message: 'site-emptied',
			});
		});
		ipcRenderer.on('tribe-site-empty-failed', (event) => {
			console.log( event );
			this.setState({
				message: 'site-empty-failed',
			});
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners('tribe-site-resetting');
		ipcRenderer.removeAllListeners('tribe-site-reset');
		ipcRenderer.removeAllListeners('tribe-site-reset-failed');
		ipcRenderer.removeAllListeners('tribe-site-reset-install-failed');
		ipcRenderer.removeAllListeners('tribe-site-emptying');
		ipcRenderer.removeAllListeners('tribe-site-emptied');
		ipcRenderer.removeAllListeners('tribe-site-empty-failed');
	}

	resetSite() {
		this.setState({
			message: 'site-resetting',
		});

		ipcRenderer.send(
			'tribe-reset-site',
			this.state.siteId,
		);
	}

	showResetButton() {
		return (
			<TextButton intent="destructive" onClick={this.resetSite} disabled={this.areButtonsDisabled()}>
				Reset this site
			</TextButton>
		);
	}

	showResetText() {
		switch ( this.state.message ) {
			case 'site-resetting':
				return (<Text margin="m">Resetting the site <LoadingIndicator /></Text>);
			case 'site-reset':
				return (<Text margin="m">This site has been reset successfully. Use admin/admin to log in.</Text>);
			case 'site-reset-failed':
				return (<Text margin="m">Error encountered, this site failed to be reset.</Text>);
			case 'site-reset-install-failed':
				return (<Text margin="m">Error encountered, the database was deleted but not be reinstalled. You will need to go to the set up page directly.</Text>);
			default:
				return;
		}
	}

	emptySite() {
		this.setState({
			message: 'site-emptying',
		});

		ipcRenderer.send(
			'tribe-empty-site',
			this.state.siteId,
		);
	}

	showEmptyButton() {
		return (
			<TextButton intent="destructive" onClick={this.emptySite} disabled={this.areButtonsDisabled()}>
				Empty this site
			</TextButton>
		);
	}

	showEmptyText() {
		switch ( this.state.message ) {
			case 'site-emptying':
				return (<Text margin="m">Emptying the site <LoadingIndicator /></Text>);
			case 'site-emptied':
				return (<Text margin="m">This site has been emptied successfully.</Text>);
			case 'site-empty-failed':
				return (<Text margin="m">Error encountered, this site failed to be emptied.</Text>);
			default:
				return;
		}
	}

	areButtonsDisabled() {
		// Tool must not be already processing request.
		if ( 'site-resetting' === this.state.message || 'site-emptying' === this.state.message ) {
			return true;
		}

		// Site must be running.
		if ( 'running' !== this.props.siteStatuses[ this.state.siteId ] ) {
			return true;
		}

		return false;
	}

	render() {
		return (
			<TableList>
				<TableListRow label="Empty Site">
					{this.showEmptyButton()}
					{this.showEmptyText()}

					<Text tag="div" margin="l">
						This tool will empty all content (posts, comments, terms, and meta) for the site including uploaded files.
						This leaves options in place and does not deactivate plugins.
					</Text>
				</TableListRow>
				<TableListRow label="Reset Site">
					{this.showResetButton()}
					{this.showResetText()}

					<Text tag="div" margin="l">
						This tool will reset the site database and reinstall WordPress.
						Note: An "admin" user will be setup with the password "admin".
					</Text>
				</TableListRow>
			</TableList>
		)
	}

}
