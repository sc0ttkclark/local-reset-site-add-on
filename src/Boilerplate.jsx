import React, {Component} from 'react';
import {ipcRenderer} from 'electron';

// https://getflywheel.github.io/local-addon-api/modules/_local_renderer_.html
// https://github.com/getflywheel/local-components
import {Container, LoadingIndicator, TableList, TableListRow, Text, TextButton} from '@getflywheel/local-components';

export default class Boilerplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			siteId: props.match.params.siteID,
			message: '',
		};

		this.resetSite = this.resetSite.bind(this);
		this.showResetButton = this.showResetButton.bind(this);
		this.showResettingText = this.showResettingText.bind(this);
		this.showResetText = this.showResetText.bind(this);
		this.showResetFailedText = this.showResetFailedText.bind(this);

		this.emptySite = this.emptySite.bind(this);
		this.showEmptyButton = this.showEmptyButton.bind(this);
		this.showEmptyingText = this.showEmptyingText.bind(this);
		this.showEmptiedText = this.showEmptiedText.bind(this);
		this.showEmptyFailedText = this.showEmptyFailedText.bind(this);

		this.areButtonsDisabled = this.areButtonsDisabled.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on('site-reset', (event) => {
			this.setState({
				message: 'site-reset',
			});
		});
		ipcRenderer.on('site-reset-failed', (event) => {
			this.setState({
				message: 'site-reset-failed',
			});
		});
		ipcRenderer.on('site-emptied', (event) => {
			this.setState({
				message: 'site-emptied',
			});
		});
		ipcRenderer.on('site-empty-failed', (event) => {
			this.setState({
				message: 'site-empty-failed',
			});
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners('site-resetting');
		ipcRenderer.removeAllListeners('site-reset');
		ipcRenderer.removeAllListeners('site-reset-failed');
		ipcRenderer.removeAllListeners('site-emptying');
		ipcRenderer.removeAllListeners('site-emptied');
		ipcRenderer.removeAllListeners('site-empty-failed');
	}

	resetSite() {
		this.setState({
			message: 'site-resetting',
		});

		ipcRenderer.send(
			'reset-site',
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

	showResettingText() {
		if ( 'site-resetting' !== this.state.message ) {
			return;
		}

		return (
			<Text margin="m">
				Resetting the site
				<LoadingIndicator />
			</Text>
		);
	}

	showResetText() {
		if ( 'site-reset' !== this.state.message ) {
			return;
		}

		return (
			<Text margin="m">
				This site has been reset successfully. Use admin/admin to log in.
			</Text>
		);
	}

	showResetFailedText() {
		if ( 'site-reset-failed' !== this.state.message ) {
			return;
		}

		return (
			<Text margin="m">
				Error encountered, this site failed to be reset.
			</Text>
		);
	}

	emptySite() {
		this.setState({
			message: 'site-emptying',
		});

		ipcRenderer.send(
			'empty-site',
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

	showEmptyingText() {
		if ( 'site-emptying' !== this.state.message ) {
			return;
		}

		return (
			<Text margin="m">
				Emptying the site
				<LoadingIndicator />
			</Text>
		);
	}

	showEmptiedText() {
		if ( 'site-emptied' !== this.state.message ) {
			return;
		}

		return (
			<Text margin="m">
				This site has been emptied successfully.
			</Text>
		);
	}

	showEmptyFailedText() {
		if ( 'site-empty-failed' !== this.state.message ) {
			return;
		}

		return (
			<Text margin="m">
				Error encountered, this site failed to be emptied.
			</Text>
		);
	}

	areButtonsDisabled() {
		if ( 'site-resetting' === this.state.message || 'site-emptying' === this.state.message ) {
			return true;
		}

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
					{this.showEmptyingText()}
					{this.showEmptiedText()}
					{this.showEmptyFailedText()}

					<Text tag="div" margin="l">
						This tool will empty all content (posts, comments, terms, and meta) for the site including uploaded files.
						This leaves options in place and does not deactivate plugins.
					</Text>
				</TableListRow>
				<TableListRow label="Reset Site">
					{this.showResetButton()}
					{this.showResettingText()}
					{this.showResetText()}
					{this.showResetFailedText()}

					<Text tag="div" margin="l">
						This tool will reset the site database and reinstall WordPress.
						Note: An "admin" user will be setup with the password "admin".
					</Text>
				</TableListRow>
			</TableList>
		)
	}

}
