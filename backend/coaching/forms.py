from django import forms


class DeclineCoachRequestForm(forms.Form):
    decline_reason = forms.CharField(
        widget=forms.Textarea(attrs={"rows": 4}),
        label="Decline reason",
    )
