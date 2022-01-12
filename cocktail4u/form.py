from django import forms


class PostComment(forms.Form):
    text = forms.CharField(label="", widget=forms.Textarea(
        attrs={'class': 'form-control'}))
