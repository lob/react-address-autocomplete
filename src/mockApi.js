export const mockAutocompleteSuccessResponse = {
  id: 'us_auto_fakeid',
  suggestions: [
    {
      primary_line: '123 Sesame St',
      city: 'New York',
      state: 'NY',
      zip_code: '12345'
    },
    {
      primary_line: "123 Bowser's Castle",
      city: 'Mushroom Kingdom',
      state: 'JA',
      zip_code: '12345'
    },
    {
      primary_line: "123 Micky's Clubhouse",
      city: 'Disneyland',
      state: 'FL',
      zip_code: '12345'
    }
  ],
  object: 'us_autocompletion'
}

export const mockAutocompleteFailureResponse = {
  error: {
    message:
      'Your API key is not valid. Please sign up on lob.com to get a valid api key.',
    status_code: 401,
    code: 'invalid_api_key'
  }
}

export const mockVerifySuccessResponse = {
  id: 'us_ver_1234567890',
  recipient: '',
  primary_line: '1600 PENNSYLVANIA AVE NW',
  secondary_line: '',
  urbanization: '',
  last_line: 'WASHINGTON DC 20502-0001',
  deliverability: 'deliverable',
  components: {
    primary_number: '1600',
    street_predirection: '',
    street_name: 'PENNSYLVANIA',
    street_suffix: 'AVE',
    street_postdirection: 'NW',
    secondary_designator: '',
    secondary_number: '',
    pmb_designator: '',
    pmb_number: '',
    extra_secondary_designator: '',
    extra_secondary_number: '',
    city: 'WASHINGTON',
    state: 'DC',
    zip_code: '20502',
    zip_code_plus_4: '0001',
    zip_code_type: 'unique',
    delivery_point_barcode: 'fake0987654321',
    address_type: 'residential',
    record_type: 'street',
    default_building_address: false,
    county: 'DISTRICT OF COLUMBIA',
    county_fips: '11001',
    carrier_route: 'C000',
    carrier_route_type: 'city_delivery',
    latitude: 38.89876,
    longitude: -77.03645
  },
  deliverability_analysis: {
    dpv_confirmation: 'Y',
    dpv_cmra: '',
    dpv_vacant: '',
    dpv_active: '',
    dpv_footnotes: ['AA', 'U1'],
    ews_match: false,
    lacs_indicator: '',
    lacs_return_code: '',
    suite_return_code: ''
  },
  lob_confidence_score: {
    score: null,
    level: ''
  },
  object: 'us_verification'
}

export const mockVerifyFailureResponse = {
  error: {
    message: 'primary_line is required or address is required',
    status_code: 422,
    code: 'invalid'
  }
}

export const mockVerifyInternationalSuccessResponse = {
  recipient: '',
  primary_line: '42 WALLABY WAY',
  secondary_line: '',
  last_line: 'SYDNEY NSW 1234',
  country: 'CA',
  coverage: 'BUILDING',
  deliverability: 'deliverable',
  status: 'LF4',
  components: {
    primary_number: '42',
    street_name: 'WALLABY WAY',
    city: 'SYDNEY',
    state: 'NSW',
    postal_code: '1234'
  },
  object: 'intl_verification',
  id: 'intl_ver_fake1234567890'
}

export const mockVerifyInternationalFailureResponse = {
  error: {
    message: 'country is required',
    status_code: 422,
    code: 'invalid'
  }
}
