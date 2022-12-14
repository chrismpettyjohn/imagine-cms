import {toast} from 'react-toastify';
import {configContext, useUpdateConfig} from '@imagine-cms/web';
import React, {ChangeEvent, SyntheticEvent, useContext, useEffect, useState} from 'react';
import {LoadingOverlay} from '../../components/loading-overlay/LoadingOverlay';

export function SiteSettingsScreen() {
  const {config} = useContext(configContext);
  const [configDTO, setConfigDTO] = useState({
    siteName: config!.siteName,
    logoURL: config!.logoURL,
    nitroURL: config!.nitroURL,
    discordURL: config!.discordURL,
    discordWidget: config!.discordWidget,
    facebookURL: config!.facebookURL,
    instagramURL: config!.instagramURL,
    twitterURL: config!.twitterURL,
    snapchatURL: config!.snapchatURL,
    dateFormat: config!.dateFormat,
  });
  const updateConfig = useUpdateConfig(configDTO);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfigDTO(_ => ({
        ..._,
      [event.target.name]: event.target.value ?? '',
    }))
  }

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    updateConfig.runMutation();
  }

  useEffect(() => {
    if (!updateConfig.loading) {

      if (updateConfig.error) {
        toast.error('There was a problem updating site settings');
      }

      if (updateConfig.data) {
        toast.success('Site settings have been updated')
      }
    }
  }, [updateConfig.data, updateConfig.error, updateConfig.loading]);

  return (
    <div className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">General Settings</h4>
            <LoadingOverlay loading={updateConfig.loading}>
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label>Site Name</label>
                  <input type="text" className="form-control" placeholder="Site Name" name="siteName" onChange={onChange} value={configDTO.siteName} />
                </div>
                <div className="form-group">
                  <label>Site Logo</label>
                  <input type="text" className="form-control" placeholder="Logo URL" name="logoURL" onChange={onChange} value={configDTO.logoURL} />
                </div>
                <hr />
                <h4 className="card-title">Social Media</h4>
                <div className="form-group">
                  <label>Facebook URL</label>
                  <input type="text" className="form-control" name="facebookURL" onChange={onChange} value={configDTO.facebookURL} />
                </div>
                <div className="form-group">
                  <label>Instagram URL</label>
                  <input type="text" className="form-control" name="instagramURL" onChange={onChange} value={configDTO.instagramURL} />
                </div>
                <div className="form-group">
                  <label>Twitter URL</label>
                  <input type="text" className="form-control" name="twitterURL" onChange={onChange} value={configDTO.twitterURL} />
                </div>
                <div className="form-group">
                  <label>Snapchat URL</label>
                  <input type="text" className="form-control" name="snapchatURL" onChange={onChange} value={configDTO.snapchatURL} />
                </div>
                <div className="form-group">
                  <label>Discord URL</label>
                  <input type="text" className="form-control" name="discordURL" onChange={onChange} value={configDTO.discordURL} />
                </div>
                <div className="form-group">
                  <label>Discord Widget</label>
                  <textarea rows={3} className="form-control" name="discordURL" onChange={onChange as any} value={configDTO.discordURL} />
                </div>
                <hr />
                <h4 className="card-title">Advanced</h4>
                <div className="form-group">
                  <label>Date Format</label>
                  <input type="text" className="form-control" placeholder="Date Format" name="dateFormat" onChange={onChange} value={configDTO.dateFormat} />
                </div>
                <button type="submit" className="btn btn-primary mr-2">Submit</button>
                <button className="btn btn-dark">Cancel</button>
              </form>
            </LoadingOverlay>
          </div>
        </div>
      </div>
    </div>
  )
}
