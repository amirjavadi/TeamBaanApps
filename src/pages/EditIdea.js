import React from 'react';
import Header from '../components/Header';
import {Dimensions, Image, TextInput, Picker, TouchableOpacity, FlatList, Platform} from 'react-native';
import {Container, Content, Text, Textarea, View, Icon} from 'native-base';
import ImagePicker from "react-native-image-crop-picker";
import axios from 'axios';
import api from './../api';
import {DotIndicator} from 'react-native-indicators';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class EditIdea extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      coarseValue: '',
      fieldValue: '',
      ideaImage: [],
      newIdeaImage: [],
      userName: '',
      nationalCode: '',
      job: '',
      email: '',
      mobile: '',
      phone: '',
      address: '',
      title: '',
      description: '',
      trackingCode: '',
      recordErrors: {},
      urls: [],
      loader: false,
      submitted: false,
      pCode: '',
      errorIdea: false,
    }
  }

  async componentDidMount() {
    let stack = [];
    if (this.props.item !== undefined) {
      this.setState({
        coarseValue: this.props.item.education,
        fieldValue: this.props.item.userDomain,
        userName: this.props.item.firstAndLastName,
        nationalCode: this.props.item.nationalCode,
        job: this.props.item.jobs,
        email: this.props.item.email,
        mobile: this.props.item.mobile,
        phone: this.props.item.phone,
        address: this.props.item.address,
        title: this.props.item.titleIdea,
        description: this.props.item.summaryIdeas,
        trackingCode: this.props.item.trackingCode,
      });
      for (let i = 0; i < this.props.item.attachment.length; i++) {
        stack.push(this.props.item.attachment[i]);
      }
      await this.setState(prevState => {
        return {
          ideaImage: [...prevState.ideaImage, ...stack],
        }
      });
    }
  }

  _changeValue(name, text) {
    let {recordErrors} = this.state;
    switch (name) {
      case 'coarse' :
        recordErrors['coarseType'] = null;
        this.setState({coarseValue: text, recordErrors});
        break;
      case 'field' :
        recordErrors['fieldType'] = null;
        this.setState({fieldValue: text, recordErrors});
        break;
    }
  }

  _setValue(name, value) {
    let {recordErrors} = this.state;
    switch (name) {
      case 'userName' :
        recordErrors['userNameType'] = null;
        this.setState({userName: value, recordErrors});
        break;
      case 'nationalCode' :
        recordErrors['nationalCodeType'] = null;
        this.setState({nationalCode: value, recordErrors});
        break;
      case 'job' :
        recordErrors['jobType'] = null;
        this.setState({job: value, recordErrors});
        break;
      case 'email' :
        recordErrors['emailType'] = null;
        this.setState({email: value, recordErrors});
        break;
      case 'mobile' :
        recordErrors['mobileType'] = null;
        this.setState({mobile: value, recordErrors});
        break;
      case 'phone' :
        recordErrors['phoneType'] = null;
        this.setState({phone: value, recordErrors});
        break;
      case 'address' :
        recordErrors['addressType'] = null;
        this.setState({address: value, recordErrors});
        break;
      case 'title' :
        recordErrors['titleType'] = null;
        this.setState({title: value, recordErrors});
        break;
      case 'description' :
        recordErrors['descriptionType'] = null;
        this.setState({description: value, recordErrors});
        break;
    }
  }

  async getFile() {
    let imageStack = [];
    let options = {
      width: 640,
      height: 640,
      cropping: true,
      includeBase64: true,
      mediaType: 'photo',
      multiple: true,
    };
    await ImagePicker.openPicker(options)
      .then((response) => {
        for (let item of response) {
          let newImageSource = {
            type: item.mime,
            base64: item.mime !== null ? `data:${item.mime};base64,${item.data}` : '',
            uri: item.mime !== null ? item.path : undefined,
            loading: false,
          };
          imageStack.push(newImageSource);
        }
        this.setState(prevState => {
          return {
            newIdeaImage: [...prevState.newIdeaImage, ...imageStack]
          }
        });
      })
      .catch((error) => {
        console.info(error);
      });
  }

  handleSetRecordValidation (rcallback) {
    let recordFormIsValid = true;
    let recordErrors = {};
    //userName
    let regexpUserName = /^[\u0600-\u06FF\s]+$/;
    if (!regexpUserName.test(this.state.userName)) {
      recordFormIsValid = false;
      recordErrors['userNameType'] = 'نام و نام خانوادگی اشتباه است.'
    }
    //job
    if (this.state.job.length < 1 || this.state.job === '' || this.state.job === null) {
      recordFormIsValid = false;
      recordErrors['jobType'] = 'فیلد نباید خالی باشد.'
    }
    //email
    let regexpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if (!regexpEmail.test(this.state.email)) {
      recordFormIsValid = false;
      recordErrors['emailType'] = 'ایمیل وارد شده اشتباه است.'
    }
    //mobile
    let regex = RegExp('^(09)\\d{9}$');
    if (!regex.test(this.state.mobile)) {
      recordFormIsValid = false;
      recordErrors['mobileType'] = 'موبایل وارد شده اشتباه است.'
    }
    //title
    if (this.state.title.length < 3 || this.state.title === '' || this.state.title === null) {
      recordFormIsValid = false;
      recordErrors['titleType'] = 'عنوان حداقل باید 3 کاراکتر باشد.'
    }
    //degree
    if (this.state.coarseValue === '' || this.state.coarseValue === null || this.state.coarseValue === 0) {
      recordFormIsValid = false;
      recordErrors['coarseType'] = 'میزان تحصیلات خود را انتخاب کنید.'
    }
    //ideaField
    if (this.state.fieldValue === '' || this.state.fieldValue === null || this.state.fieldValue === 0) {
      recordFormIsValid = false;
      recordErrors['fieldType'] = 'تخصص ایده خود را انتخاب کنید.'
    }

    this.setState({recordErrors}, () => {
      return rcallback(recordFormIsValid)
    })
  }

  submit() {
    this.handleSetRecordValidation((valid) => {
      if (valid) {
        this.setState({loader: true});
        if (this.state.newIdeaImage.length > 0) {
          this.firstStep();
        } else {
          this.nextStep()
        }
      }
    })
  }

  async firstStep() {
    let urls = [];
    for (let i = 0; i < this.state.newIdeaImage.length; i++) {
      let body = new FormData();
      body.append('photo', {uri: this.state.newIdeaImage[i].uri, name: `photo${i}.png`, filename: `imageName${i}.png`, type: 'image/png'});
      body.append('Content-Type', 'image/png');
      await axios.post(api.url + '/api/UIE2016/UploadImage', body)
        .then((response) => {
          let url = JSON.parse("[" + response.data + "]");
          urls.push(url[0][0]);
        })
        .catch((error) => console.info(1, 'error'))
    }
    this.nextStep(urls)
  }

  nextStep(urls) {
    let image = [];
    if (urls !== undefined) {
      for (let i = 0; i < urls.length; i++) {
        image.push(urls[i])
      }
    }
    for (let j = 0; j < this.state.ideaImage.length; j++) {
      image.push(this.state.ideaImage[j])
    }
    let headers = {
      'Content-Type': 'application/json',
    };
    let data = {
      FirstAndLastName: this.state.userName,
      Jobs: this.state.job,
      Education: this.state.coarseValue,
      NationalCode: this.state.nationalCode,
      Address: this.state.address,
      Mobile: this.state.mobile,
      Email: this.state.email,
      Phone: this.state.phone,
      TitleIdea: this.state.title,
      SummaryIdeas: this.state.description,
      UserDomain: this.state.fieldValue,
      StrengthsWeaknesses: '',
      SimilarExamples: '',
      Capital: '',
      Targer: '',
      TrackingCode: this.state.trackingCode,
      NewTrackingCode: '',
      Result: '',
      Attachment: image,
    };
    axios.post(api.url + '/api/UIE2016/SaveIdeal', JSON.stringify(data), {headers: headers})
      .then((response) => {
        this.setState({loader: false, submitted: true, pCode: response.data})
      })
      .catch((error) => this.setState({errorIdea: true, loader: false, submitted: false}))
  }

  async _removeImage1(item, index) {
    let ideaImage = this.state.ideaImage;
      ideaImage.splice(index, 1);
    await this.setState({
      ideaImage,
    });
  }

  async _removeImage2(item, index) {
    let newIdeaImage = this.state.newIdeaImage;
    newIdeaImage.splice(index, 1);
    await this.setState({
      newIdeaImage,
    });
  }

  render() {
    let {recordErrors} = this.state;
    return(
      <Container>
        <Header name="ثبت ایده"/>
        <View style={{position: 'absolute', width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: '#5c5c5c', marginLeft: -deviceWidth / 2, marginTop: -deviceHeight / 10, transform: [{rotate: '-12deg'}], elevation: 5, zIndex: 10}}>
          <View style={{width: deviceWidth * 2, height: deviceHeight / 4, backgroundColor: 'white', opacity: 0.2, marginLeft: -deviceWidth / 3, marginTop: -10, transform: [{rotate: '4deg'}]}}/>
          <Image source={require('./../pictures/rocket-white.png')} style={{position: 'absolute', zIndex: 4, bottom: 0, right: 0, width: deviceWidth / 8, height: deviceHeight / 9, resizeMode: 'contain', transform: [{rotate: '17deg'}], marginRight: deviceWidth / 2 - 10}}/>
        </View>
        <Content>
          <View style={{width: deviceWidth - 40, marginHorizontal: 20, marginTop: deviceHeight / 8, marginBottom: 30, direction: 'rtl', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 10}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>نام و نام خانوادگی* :</Text>
                <TextInput value={this.state.userName} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['userNameType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('userName', text)}/>
              </View>
            </View>

            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>کد ملی* :</Text>
                <TextInput value={this.state.nationalCode} maxLength={10} keyboardType="numeric" style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['nationalCodeType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('nationalCode', text)}/>
              </View>
            </View>

            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>شغل* :</Text>
                <TextInput value={this.state.job} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['jobType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('job', text)}/>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20, borderBottomWidth: 1, borderBottomColor: recordErrors['coarseType'] ? 'red' : '#dcdcdc'}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>میزان تحصیلات* :</Text>
                <Picker style={{width: deviceWidth - 40, height: 35, marginTop: 5}} selectedValue={this.state.coarseValue} mode="dialog" onValueChange={(itemValue) => this._changeValue('coarse', itemValue)}>
                  <Picker.Item key={'choose'} label='انتخاب کنید...' value={0} />
                  <Picker.Item key={'دیپلم'} label='دیپلم' value='دیپلم' />
                  <Picker.Item key={'فوق دیپلم'} label='فوق دیپلم' value='فوق دیپلم' />
                  <Picker.Item key={'لیسانس'} label='لیسانس' value='لیسانس' />
                  <Picker.Item key={'فوق لیسانس'} label='فوق لیسانس' value='فوق لیسانس' />
                  <Picker.Item key={'دکترا'} label='دکترا' value='دکترا' />
                </Picker>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>ایمیل* :</Text>
                <TextInput value={this.state.email} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['emailType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('email', text)}/>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>تلفن همراه* :</Text>
                <TextInput value={this.state.mobile} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['mobileType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('mobile', text)}/>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>تلفن ثابت :</Text>
                <TextInput value={this.state.phone} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['phoneType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('phone', text)}/>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>آدرس :</Text>
                <TextInput value={this.state.address} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['addressType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('address', text)}/>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>عنوان ایده* :</Text>
                <TextInput value={this.state.title} style={{width: deviceWidth - 40, borderBottomWidth: 1, borderBottomColor: recordErrors['titleType'] ? 'red' : '#dcdcdc', padding: 5, textAlign: 'right', direction: 'rtl', fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}} onChangeText={(text) => this._setValue('title', text)}/>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20, borderBottomWidth: 1, borderBottomColor: recordErrors['fieldType'] ? 'red' : '#dcdcdc'}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>تخصص ایده* :</Text>
                <Picker style={{width: deviceWidth - 40, height: 35, marginTop: 5}} selectedValue={this.state.fieldValue} mode="dialog" onValueChange={(itemValue) => this._changeValue('field', itemValue)}>
                  <Picker.Item key={'choose'} label='انتخاب کنید...' value={0} />
                  <Picker.Item key={'صنعتی'} label='صنعتی' value='صنعتی' />
                  <Picker.Item key={'کشاورزی'} label='کشاورزی' value='کشاورزی' />
                  <Picker.Item key={'خدماتی'} label='خدماتی' value='خدماتی' />
                  <Picker.Item key={'پزشکی'} label='پزشکی' value='پزشکی' />
                  <Picker.Item key={'فرهنگی'} label='فرهنگی' value='فرهنگی' />
                  <Picker.Item key={'مشاغل خانگی'} label='مشاغل خانگی' value='مشاغل خانگی' />
                  <Picker.Item key={'سایر'} label='سایر' value='سایر' />
                </Picker>
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <View Style={{flexDirection: 'column'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#888888'}}>خلاصه ایده :</Text>
                <Textarea
                  maxLength={250}
                  rowSpan={5}
                  placeholder="....."
                  onChangeText={(itemValue) => this._setValue('description', itemValue)}
                  placeholderTextColor="#999999"
                  style={{width: deviceWidth - 40, backgroundColor: recordErrors['descriptionType'] ? 'rgba(255,51,61,0.3)' : '#f6f6f6', borderRadius: 5, marginTop: 3, direction: 'rtl', textAlign: 'right', fontSize: 14, fontFamily: 'Vazir-FD', color: '#333333'}}
                  value={this.state.description}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{flexDirection: 'column', padding: 0, marginTop: 20}}>
              <TouchableOpacity activeOpacity={0.7}  style={{width: deviceWidth - 40, height: deviceHeight / 7, borderWidth: 1, borderStyle: 'dashed', borderColor: '#dcdcdc', borderRadius: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}} onPress={() => this.getFile()}>
                <Text style={{fontSize: 12, fontFamily: 'Vazir-FD', color: '#aaaaaa'}}>بارگذاری فایل پیوستی</Text>
                <Text style={{fontSize: 9, fontFamily: 'Vazir-FD', color: 'red', marginTop: 10}}>فرمت های قابل ارسال (png,*.gif,*.jpeg,*.jpg.*)</Text>
              </TouchableOpacity>
              {this.state.ideaImage.length > 0&&
              <View style={{height: (deviceWidth * 30) / 100 + 20, paddingVertical: 10}}>
                <FlatList
                  horizontal={true}
                  data={this.state.ideaImage}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <View style={{width: (deviceWidth * 30) / 100, height: (deviceWidth * 30) / 100, borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10, marginHorizontal: 5,}}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{width: 20, height: 20, borderRadius: 100, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 10, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#dcdcdc'}} onPress={() => this._removeImage1(item, index)}>
                        <Icon type="MaterialCommunityIcons" name="close" style={{color: '#333333', fontSize: 16}} />
                      </TouchableOpacity>
                      <Image source={{uri: item}} style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 5, borderWidth: 1, borderColor: '#dcdcdc'}} />
                    </View>
                  )}
                />
              </View>}
              {this.state.newIdeaImage.length > 0 &&
              <View style={{height: (deviceWidth * 30) / 100 + 20, paddingVertical: 10}}>
                <FlatList
                  horizontal={true}
                  data={this.state.newIdeaImage}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <View style={{width: (deviceWidth * 30) / 100, height: (deviceWidth * 30) / 100, borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10, marginHorizontal: 5,}}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{width: 20, height: 20, borderRadius: 100, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 10, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#dcdcdc'}} onPress={() => this._removeImage2(item, index)}>
                        <Icon type="MaterialCommunityIcons" name="close" style={{color: '#333333', fontSize: 16}} />
                      </TouchableOpacity>
                      <Image source={item} style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 5, borderWidth: 1, borderColor: '#dcdcdc'}} />
                    </View>
                  )}
                />
              </View>}
            </View>
            <View style={{width: deviceWidth - 40, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
              {!this.state.submitted && <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginBottom: 10}} onPress={() => this.submit()} disabled={this.state.loader}>
                <Image source={require('./../pictures/submitIdea.png')} style={{width: deviceWidth * 30 / 100, height: deviceHeight / 18, resizeMode: 'contain', borderRadius: 5, opacity: this.state.loader ? 0.2 : 1}} />
              </TouchableOpacity>}
              {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', justifyContent: 'center', width: '100%', height: 30, marginBottom: 10}}/>}
              <Text style={{display: recordErrors['userNameType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['userNameType']}</Text>
              <Text style={{display: recordErrors['nationalCodeType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['nationalCodeType']}</Text>
              <Text style={{display: recordErrors['jobType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['jobType']}</Text>
              <Text style={{display: recordErrors['coarseType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['coarseType']}</Text>
              <Text style={{display: recordErrors['emailType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['emailType']}</Text>
              <Text style={{display: recordErrors['mobileType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['mobileType']}</Text>
              <Text style={{display: recordErrors['phoneType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['phoneType']}</Text>
              <Text style={{display: recordErrors['addressType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['addressType']}</Text>
              <Text style={{display: recordErrors['titleType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['titleType']}</Text>
              <Text style={{display: recordErrors['fieldType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['fieldType']}</Text>
              <Text style={{display: recordErrors['descriptionType'] ? 'flex' : 'none', fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>{recordErrors['descriptionType']}</Text>
              {this.state.errorIdea && <Text style={{color: 'red', fontFamily: 'Vazir-FD', fontSize: 14, marginTop: 15}}>متاسفانه مشکلی در ثبت ایده به وجود آمده است.</Text>}
              {this.state.errorIdea && <Text style={{color: 'red', fontFamily: 'Vazir-FD', fontSize: 14, marginTop: 15}}>لطفا دوباره سعی کنید.</Text>}
              {this.state.submitted &&
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {this.state.trackingCode !== '' && <Text style={{ fontSize: 14, ...Platform.select({
                    ios: {
                      fontFamily: 'Vazir-FD',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    },
                    android: {
                      textAlign: 'center',
                      fontFamily: 'Vazir-Bold-FD',
                    }
                  }), color: 'green'}}>ایده شما با موفقیت ویرایش شد.</Text>}
                <View style={{flexDirection: 'row'}}>
                  <Text style={{ fontSize: 14, ...Platform.select({
                      ios: {
                        fontFamily: 'Vazir-FD',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      },
                      android: {
                        textAlign: 'center',
                        fontFamily: 'Vazir-Bold-FD',
                      }
                    }), color: 'green'}}>کد پیگیری ایده شما : </Text>
                  <Text style={{ fontSize: 16, ...Platform.select({
                      ios: {
                        fontFamily: 'Vazir-FD',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      },
                      android: {
                        textAlign: 'center',
                        fontFamily: 'Vazir-Bold-FD',
                      }
                    }), color: '#333333', borderBottomWidth: 1, borderBottomColor: '#dcdcdc'}}>{this.state.pCode}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{width: deviceWidth / 7, height: deviceHeight / 22, borderWidth: 1, borderColor: 'green', borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 10}} onPress={() => Actions.reset('tabBar')}>
                  <Text style={{fontSize: 14, color: 'green', fontFamily: 'Vazir-FD'}}>تایید</Text>
                </TouchableOpacity>
              </View>}
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}
