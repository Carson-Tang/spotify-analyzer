import React from 'react';
import { Button, Grid, Label, Image, Item } from 'semantic-ui-react'
import { User, UserTop, TrackFeatures, TrackAnalysis } from 'react-spotify-api'

const UserInfo = () => {

  return (
    <>
      <Grid>
        <Grid.Row>
          <User>
            {(user, loading, error) => 
              user && user.data ? (
                <>
                  <Image avatar size='small' src={user.data.images[0].url} />
                    <Item>
                      <Item.Content>
                        <Item.Header>{user.data.display_name}</Item.Header>
                        <Item.Meta>
                          Country: {user.data.country}
                        </Item.Meta>
                        <Item.Meta>
                          Followers: {user.data.followers.total}
                        </Item.Meta>
                      </Item.Content>
                    </Item>
                </>
              ) : null
            }
          </User>
        </Grid.Row>
      </Grid>
    </>
  );
}

export default UserInfo;




